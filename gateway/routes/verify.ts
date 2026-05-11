import type { Request, Response } from 'express';
import { config, isConfigured } from '../config.js';

// VerificationReportStatus enum values (mirroring proto definition)
const REPORT_STATUS = {
  IN_PROGRESS: 1,
  FAILED: 2,
  COMPLETED: 3,
  CANCELLED: 4,
} as const;

interface VerifyStartBody {
  work_id: string;
}

// POST /demo/verify
// Triggers Hawk-Eye work verification on a pre-seeded demo job.
// Returns { report_id: string } immediately. Client then polls GET /demo/verify/:reportId.
export async function handleVerifyStart(req: Request, res: Response): Promise<void> {
  const body = req.body as VerifyStartBody;

  if (!body.work_id) {
    res.status(400).json({ error: 'work_id is required' });
    return;
  }

  if (!isConfigured('verify')) {
    res.status(501).json({
      error: 'VERIFY_SERVICE_URL and VERIFY_API_KEY are not configured. See gateway/.env.example.',
      hint: 'Engineering: pre-seed a demo job with real photos in staging and set DEMO_WV_WORK_ID_HWH.',
    });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.verify.startTimeoutMs);

  try {
    // Engineering: confirm exact Hawk-Eye start endpoint path.
    // Expected: POST /v1/work-verification/start with { work_id }
    // Returns: { report_id: string, status: VerificationReportStatus }
    const upstreamRes = await fetch(`${config.verify.serviceUrl}/v1/work-verification/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.verify.apiKey}`,
      },
      body: JSON.stringify({ work_id: body.work_id }),
      signal: controller.signal,
    });

    if (!upstreamRes.ok) {
      const text = await upstreamRes.text();
      console.error(`[verify-start] upstream error ${upstreamRes.status}:`, text);
      res.status(upstreamRes.status).json({ error: `Hawk-Eye error: ${upstreamRes.statusText}`, detail: text });
      return;
    }

    const data = await upstreamRes.json() as { report_id: string };
    res.json({ report_id: data.report_id });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.error('[verify-start] timed out after', config.verify.startTimeoutMs, 'ms');
      res.status(504).json({ error: 'Hawk-Eye start timed out.' });
      return;
    }
    console.error('[verify-start] unexpected error:', err);
    res.status(500).json({ error: 'Internal gateway error', detail: String(err) });
  } finally {
    clearTimeout(timeout);
  }
}

// GET /demo/verify/:reportId
// Polls Hawk-Eye for report status. Returns the full WorkVerificationReportV2 when complete.
// Hawk-Eye is async — typical latency is 15–45 seconds. The gateway polls on behalf of the client,
// waiting up to VERIFY_MAX_WAIT_MS before returning 504.
export async function handleVerifyPoll(req: Request, res: Response): Promise<void> {
  const { reportId } = req.params;

  if (!reportId) {
    res.status(400).json({ error: 'reportId path parameter is required' });
    return;
  }

  if (!isConfigured('verify')) {
    res.status(501).json({ error: 'Verify service is not configured. See gateway/.env.example.' });
    return;
  }

  const started = Date.now();
  const POLL_INTERVAL_MS = 2_000;

  while (true) {
    const elapsed = Date.now() - started;
    if (elapsed >= config.verify.maxWaitMs) {
      console.error('[verify-poll] max wait exceeded for reportId:', reportId);
      res.status(504).json({
        error: 'Hawk-Eye did not complete within the allowed time. Try again later.',
        elapsed_ms: elapsed,
      });
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.verify.pollTimeoutMs);

    try {
      // Engineering: confirm exact Hawk-Eye report endpoint path.
      // Expected: GET /v1/work-verification/reports/:reportId
      // Returns: WorkVerificationReportV2 with verification_report_status field
      const upstreamRes = await fetch(
        `${config.verify.serviceUrl}/v1/work-verification/reports/${reportId}`,
        {
          headers: { 'Authorization': `Bearer ${config.verify.apiKey}` },
          signal: controller.signal,
        },
      );

      if (!upstreamRes.ok) {
        const text = await upstreamRes.text();
        console.error(`[verify-poll] upstream error ${upstreamRes.status}:`, text);
        res.status(upstreamRes.status).json({ error: `Hawk-Eye error: ${upstreamRes.statusText}`, detail: text });
        return;
      }

      const report = await upstreamRes.json() as Record<string, unknown>;
      const status = report.verification_report_status as number;

      if (status === REPORT_STATUS.COMPLETED) {
        console.log(`[verify-poll] reportId ${reportId} completed in ${Date.now() - started}ms`);
        res.json(report);
        return;
      }

      if (status === REPORT_STATUS.FAILED || status === REPORT_STATUS.CANCELLED) {
        console.error(`[verify-poll] reportId ${reportId} terminal status: ${status}`);
        res.status(422).json({
          error: `Hawk-Eye workflow ended with status ${status}. Check Hawk-Eye logs.`,
          report,
        });
        return;
      }

      // Still in progress — wait and retry
      await sleep(POLL_INTERVAL_MS);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Single poll timed out — wait briefly and retry rather than fail the whole request
        console.warn('[verify-poll] single poll timed out, retrying...');
        await sleep(POLL_INTERVAL_MS);
        continue;
      }
      console.error('[verify-poll] unexpected error:', err);
      res.status(500).json({ error: 'Internal gateway error', detail: String(err) });
      return;
    } finally {
      clearTimeout(timeout);
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
