# DMG AI Flight Simulator — Demo Gateway

Thin Node.js/Express BFF that sits between the React frontend and DMG's internal AI services. Holds credentials, translates requests, and handles the async Hawk-Eye poll loop.

## Architecture

```
Browser (React) → Vite proxy (/demo/*) → Demo Gateway (port 3001) → DMG internal services
```

## Routes

| Method | Route | Service | Notes |
|--------|-------|---------|-------|
| POST | `/demo/qualify` | fulfillment-prediction (IRIS) | Returns `{ prediction, workActions }` |
| POST | `/demo/match` | matching-engine + GDA/Cipher | Returns ranked providers with AI rationale |
| POST | `/demo/verify` | work-verification-api (Hawk-Eye) | Starts async verification, returns `{ report_id }` |
| GET | `/demo/verify/:reportId` | work-verification-api | Polls until complete, returns `WorkVerificationReportV2` |

## Setup

```bash
cp .env.example .env
# Fill in credentials and service URLs
npm install
npm run dev       # starts with tsx --watch on port 3001
```

## Environment Variables

See `.env.example` for the full list. The key ones to fill in:

```
QUALIFY_SERVICE_URL   # IRIS/fulfillment-prediction REST URL
QUALIFY_API_KEY       # Service account bearer token

MATCH_SERVICE_URL     # Matching engine REST URL
GDA_SERVICE_URL       # GDA/Cipher REST URL (AI recommendations)
MATCH_API_KEY         # Service account bearer token

VERIFY_SERVICE_URL    # work-verification-api REST URL
VERIFY_API_KEY        # Service account bearer token
```

When any credential is missing, the route returns `501 Not Implemented` with an engineering note.

## Switching from Mock to Real

The frontend defaults to mock mode. To use the real gateway:

1. Start the gateway: `npm run dev` (in this directory)
2. In the frontend's `.env`: set `VITE_USE_MOCK=false`
3. Restart the Vite dev server

## Engineering Prerequisites

Before the gateway can proxy real calls, engineering must:

1. **IRIS/Qualify**: provision a demo service account with `fulfillment-prediction` ACLs; confirm the REST endpoint path and auth mechanism.

2. **Match**: provision demo property IDs in staging (Heartland Dental / Walgreens / Dollar General) that have coverage for plumbing, HVAC, and general maintenance respectively. Confirm matching engine REST contract.

3. **Verify (Hawk-Eye)**: pre-seed three demo work IDs in staging — each must have real before/during/after visit photos already uploaded. The gateway triggers Hawk-Eye on a fixed `work_id` from `.env`. Confirm work-verification-api endpoint paths.

4. **Environment**: confirm whether to use staging or prod for each service. Prod gives the most impressive AI outputs but requires appropriate ACLs for demo traffic. Consider a Statsig flag to route demo calls to a lighter GPT model to control cost.

## Timeout Configuration

- IRIS: 45s (GPT-4 call)
- Matching engine: 30s
- Hawk-Eye start: 15s
- Hawk-Eye poll: polls every 2s, max 90s before 504

These are configurable via env vars. See `.env.example`.
