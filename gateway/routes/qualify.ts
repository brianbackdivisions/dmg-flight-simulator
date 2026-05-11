import type { Request, Response } from 'express';
import { config, isConfigured } from '../config.js';

interface QualifyRequestBody {
  ticket_scope: string;
  image_attachment_ids: string[];
  service_line_id: string | null;
}

// POST /demo/qualify
// Proxies to DMG fulfillment-prediction (IRIS) service.
// Returns { prediction: PredictionResponse, workActions: WorkAction[] }
export async function handleQualify(req: Request, res: Response): Promise<void> {
  const body = req.body as QualifyRequestBody;

  if (!body.ticket_scope) {
    res.status(400).json({ error: 'ticket_scope is required' });
    return;
  }

  if (!isConfigured('qualify')) {
    res.status(501).json({
      error: 'QUALIFY_SERVICE_URL and QUALIFY_API_KEY are not configured. See gateway/.env.example.',
      hint: 'Engineering: provision a demo service account with fulfillment-prediction ACLs.',
    });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.qualify.timeoutMs);

  try {
    // IRIS REST endpoint — Engineering: confirm exact path + auth mechanism
    // Expected contract (gRPC-transcoded REST):
    //   POST {serviceUrl}/v1/predictions
    //   Body: { ticket_scope, image_attachment_ids, service_line_id }
    //   Response: GetPredictionsSuccessResponse { work_actions[], prediction_response{} }
    const upstreamRes = await fetch(`${config.qualify.serviceUrl}/v1/predictions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.qualify.apiKey}`,
      },
      body: JSON.stringify({
        ticket_scope: body.ticket_scope,
        image_attachment_ids: body.image_attachment_ids ?? [],
        service_line_id: body.service_line_id ?? null,
      }),
      signal: controller.signal,
    });

    if (!upstreamRes.ok) {
      const text = await upstreamRes.text();
      console.error(`[qualify] upstream error ${upstreamRes.status}:`, text);
      res.status(upstreamRes.status).json({ error: `Upstream error: ${upstreamRes.statusText}`, detail: text });
      return;
    }

    const data = await upstreamRes.json() as Record<string, unknown>;

    // Engineering: adjust these field mappings once the real API response shape is confirmed.
    // The IRIS service returns a GetPredictionsSuccessResponse with:
    //   - work_actions: WorkAction[]
    //   - prediction fields: service_line_id, service_type_id, work_complexity, etc.
    //
    // We re-shape into the frontend's expected { prediction, workActions } envelope.
    const prediction = extractPrediction(data);
    const workActions = Array.isArray(data.work_actions) ? data.work_actions : [];

    res.json({ prediction, workActions });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.error('[qualify] request timed out after', config.qualify.timeoutMs, 'ms');
      res.status(504).json({ error: 'Qualification service timed out. The AI call may be slow — retry.' });
      return;
    }
    console.error('[qualify] unexpected error:', err);
    res.status(500).json({ error: 'Internal gateway error', detail: String(err) });
  } finally {
    clearTimeout(timeout);
  }
}

// Maps raw IRIS response fields to the PredictionResponse shape expected by the frontend.
// Engineering: update field names once the real API is confirmed.
function extractPrediction(data: Record<string, unknown>): Record<string, unknown> {
  return {
    is_recall: data.is_recall ?? false,
    is_recall_v2: data.is_recall_v2 ?? false,
    is_estimate: data.is_estimate ?? false,
    is_parts_and_order: data.is_parts_and_order ?? false,
    service_type_id: data.service_type_id ?? '',
    service_line_id: data.service_line_id ?? '',
    is_project_work: data.is_project_work ?? false,
    enriched_ticket_scope: data.enriched_ticket_scope ?? data.concise_work_scope ?? '',
    work_scope: data.work_scope ?? data.detailed_work_scope ?? '',
    work_type: data.work_type ?? '',
    asset: data.asset ?? '',
    location: data.location ?? '',
    special_instructions: data.special_instructions ?? '',
    recommendation_id: data.recommendation_id ?? '',
    work_complexity: data.work_complexity ?? '',
  };
}
