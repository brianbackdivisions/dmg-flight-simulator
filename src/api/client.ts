import type { QualifyRequest, MatchRequest, VerifyRequest } from './types';
import type {
  PredictionResponse,
  MatchResponse,
  WorkVerificationReportV2,
  WorkAction,
} from '@/data/types';
import {
  MOCK_QUALIFY_RESPONSE,
  MOCK_WORK_ACTIONS,
  MOCK_MATCH_RESPONSE,
  MOCK_VERIFY_RESPONSE,
} from './mock';

// Set VITE_USE_MOCK=false in .env to route through the real Demo Gateway
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const GATEWAY_BASE = '/demo';

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${GATEWAY_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gateway error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${GATEWAY_BASE}${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gateway error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// Use shorter delays when page is hidden (throttled rAF/setTimeout in background tabs)
function delay(ms: number) {
  const effective = document.visibilityState === 'hidden' ? Math.min(ms, 300) : ms;
  return new Promise((resolve) => setTimeout(resolve, effective));
}

export async function qualify(
  req: QualifyRequest,
): Promise<{ prediction: PredictionResponse; workActions: WorkAction[] }> {
  if (USE_MOCK) {
    await delay(3500 + Math.random() * 1500);
    return { prediction: MOCK_QUALIFY_RESPONSE, workActions: MOCK_WORK_ACTIONS };
  }
  return post('/qualify', req);
}

export async function match(req: MatchRequest): Promise<MatchResponse> {
  if (USE_MOCK) {
    await delay(3000 + Math.random() * 1000);
    return MOCK_MATCH_RESPONSE;
  }
  return post('/match', req);
}

export async function startVerify(req: VerifyRequest): Promise<{ report_id: string }> {
  if (USE_MOCK) {
    await delay(500);
    return { report_id: 'rpt-abc123' };
  }
  return post('/verify', req);
}

export async function pollVerify(reportId: string): Promise<WorkVerificationReportV2> {
  if (USE_MOCK) {
    await delay(3000 + Math.random() * 1000);
    return MOCK_VERIFY_RESPONSE;
  }
  return get(`/verify/${reportId}`);
}
