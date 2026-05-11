import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { handleQualify } from './routes/qualify.js';
import { handleMatch } from './routes/match.js';
import { handleVerifyStart, handleVerifyPoll } from './routes/verify.js';

const app = express();

// Allow requests from the Vite dev server
app.use(cors({
  origin: [
    'http://localhost:5173',  // Vite dev default
    'http://localhost:4173',  // Vite preview
    /^http:\/\/localhost:\d+$/,
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '2mb' }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: config.nodeEnv, port: config.port });
});

// Demo routes — all prefixed with /demo to match the Vite proxy config
app.post('/demo/qualify', handleQualify);
app.post('/demo/match', handleMatch);
app.post('/demo/verify', handleVerifyStart);
app.get('/demo/verify/:reportId', handleVerifyPoll);

// 404 catch-all
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found. Available routes: POST /demo/qualify, POST /demo/match, POST /demo/verify, GET /demo/verify/:reportId' });
});

app.listen(config.port, () => {
  console.log(`[gateway] Demo Gateway running on http://localhost:${config.port}`);
  console.log(`[gateway] Qualify service: ${config.qualify.serviceUrl || '⚠ not configured'}`);
  console.log(`[gateway] Match service:   ${config.match.serviceUrl || '⚠ not configured'}`);
  console.log(`[gateway] Verify service:  ${config.verify.serviceUrl || '⚠ not configured'}`);
});
