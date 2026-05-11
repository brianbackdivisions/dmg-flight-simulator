import 'dotenv/config';

function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

function optional(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

function optionalInt(key: string, fallback: number): number {
  const val = process.env[key];
  if (!val) return fallback;
  const n = parseInt(val, 10);
  if (isNaN(n)) throw new Error(`Env var ${key} must be an integer, got: ${val}`);
  return n;
}

export const config = {
  port: optionalInt('PORT', 3001),
  nodeEnv: optional('NODE_ENV', 'development'),

  qualify: {
    serviceUrl: optional('QUALIFY_SERVICE_URL'),
    apiKey: optional('QUALIFY_API_KEY'),
    timeoutMs: optionalInt('QUALIFY_TIMEOUT_MS', 45_000),
  },

  match: {
    serviceUrl: optional('MATCH_SERVICE_URL'),
    gdaServiceUrl: optional('GDA_SERVICE_URL'),
    apiKey: optional('MATCH_API_KEY'),
    timeoutMs: optionalInt('MATCH_TIMEOUT_MS', 30_000),
    demoPropertyIds: {
      'hot-water-heater': optional('DEMO_PROPERTY_ID_HWH', 'DEMO_HEARTLAND_BLOOMINGTON_IL'),
      'hvac-not-cooling': optional('DEMO_PROPERTY_ID_HVAC', 'DEMO_WALGREENS_AUSTIN_TX'),
      'ceiling-tile-damage': optional('DEMO_PROPERTY_ID_CEILING', 'DEMO_DOLLAR_GENERAL_MEMPHIS_TN'),
    },
  },

  verify: {
    serviceUrl: optional('VERIFY_SERVICE_URL'),
    apiKey: optional('VERIFY_API_KEY'),
    startTimeoutMs: optionalInt('VERIFY_START_TIMEOUT_MS', 15_000),
    pollTimeoutMs: optionalInt('VERIFY_POLL_TIMEOUT_MS', 10_000),
    maxWaitMs: optionalInt('VERIFY_MAX_WAIT_MS', 90_000),
    demoWorkIds: {
      'hot-water-heater': optional('DEMO_WV_WORK_ID_HWH', 'DEMO_WV_PLUMBING_WATER_HEATER_01'),
      'hvac-not-cooling': optional('DEMO_WV_WORK_ID_HVAC', 'DEMO_WV_HVAC_NOT_COOLING_01'),
      'ceiling-tile-damage': optional('DEMO_WV_WORK_ID_CEILING', 'DEMO_WV_CEILING_TILE_01'),
    },
  },
} as const;

export function isConfigured(service: 'qualify' | 'match' | 'verify'): boolean {
  switch (service) {
    case 'qualify': return !!(config.qualify.serviceUrl && config.qualify.apiKey);
    case 'match':   return !!(config.match.serviceUrl && config.match.apiKey);
    case 'verify':  return !!(config.verify.serviceUrl && config.verify.apiKey);
  }
}
