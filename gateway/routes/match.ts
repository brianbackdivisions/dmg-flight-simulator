import type { Request, Response } from 'express';
import { config, isConfigured } from '../config.js';

interface MatchRequestBody {
  service_line_id: string;
  service_type_id: string;
  property_id: string;
  is_emergency: boolean;
  minimum_matching_score: number;
  minimum_providers_required: number;
}

// POST /demo/match
// Calls the matching engine to get scored providers, then calls GDA/Cipher
// for AI-ranked recommendations with natural-language rationale.
// Returns MatchResponse: { providers: ProviderScore[], total_matched, recommended_provider_id }
export async function handleMatch(req: Request, res: Response): Promise<void> {
  const body = req.body as MatchRequestBody;

  if (!body.service_line_id || !body.property_id) {
    res.status(400).json({ error: 'service_line_id and property_id are required' });
    return;
  }

  if (!isConfigured('match')) {
    res.status(501).json({
      error: 'MATCH_SERVICE_URL and MATCH_API_KEY are not configured. See gateway/.env.example.',
      hint: 'Engineering: provision demo property IDs in staging and confirm matching engine REST contract.',
    });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.match.timeoutMs);

  try {
    // Step 1: Call matching engine for scored providers
    // Engineering: confirm exact endpoint path + GetMatchingProvidersRequest field names
    const matchRes = await fetch(`${config.match.serviceUrl}/v1/providers/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.match.apiKey}`,
      },
      body: JSON.stringify({
        service_line_id: body.service_line_id,
        service_type_id: body.service_type_id,
        property_id: body.property_id,
        minimum_matching_score: body.minimum_matching_score ?? 60,
        is_emergency: body.is_emergency ?? false,
        required_licenses: [],
        should_apply_customer_preference_filter: true,
        minimum_providers_required: body.minimum_providers_required ?? 3,
      }),
      signal: controller.signal,
    });

    if (!matchRes.ok) {
      const text = await matchRes.text();
      console.error(`[match] matching engine error ${matchRes.status}:`, text);
      res.status(matchRes.status).json({ error: `Matching engine error: ${matchRes.statusText}`, detail: text });
      return;
    }

    const matchData = await matchRes.json() as Record<string, unknown>;
    const rawProviders = Array.isArray(matchData.providers) ? matchData.providers : [];

    // Step 2: Call GDA/Cipher for AI-ranked recommendations
    // GDA enriches the top providers with natural-language rationale and MatchingDecoration labels.
    // Engineering: confirm GDA/Cipher endpoint contract
    let gdaEnriched: Record<string, unknown>[] = rawProviders;

    if (config.match.gdaServiceUrl) {
      try {
        const gdaRes = await fetch(`${config.match.gdaServiceUrl}/v1/recommendations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.match.apiKey}`,
          },
          body: JSON.stringify({
            providers: rawProviders,
            service_line_id: body.service_line_id,
            property_id: body.property_id,
            is_emergency: body.is_emergency,
          }),
          signal: controller.signal,
        });

        if (gdaRes.ok) {
          const gdaData = await gdaRes.json() as Record<string, unknown>;
          gdaEnriched = Array.isArray(gdaData.providers) ? gdaData.providers : rawProviders;
        } else {
          console.warn('[match] GDA enrichment failed, falling back to raw match data');
        }
      } catch (gdaErr) {
        console.warn('[match] GDA call error, falling back to raw match data:', gdaErr);
      }
    }

    // Re-shape into the frontend MatchResponse format
    const response = {
      providers: gdaEnriched,
      total_matched: typeof matchData.total_matched === 'number'
        ? matchData.total_matched
        : gdaEnriched.length,
      recommended_provider_id: findTopRecommendation(gdaEnriched),
    };

    res.json(response);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.error('[match] request timed out after', config.match.timeoutMs, 'ms');
      res.status(504).json({ error: 'Matching service timed out. Retry or check service health.' });
      return;
    }
    console.error('[match] unexpected error:', err);
    res.status(500).json({ error: 'Internal gateway error', detail: String(err) });
  } finally {
    clearTimeout(timeout);
  }
}

function findTopRecommendation(providers: Record<string, unknown>[]): string | null {
  const top = providers.find((p) => p.is_provider_recommended_for_job === true);
  return (top?.provider_id as string) ?? null;
}
