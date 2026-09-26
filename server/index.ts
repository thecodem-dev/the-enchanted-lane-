import express from 'express';
import type { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';
import { ml_kem768 } from '@noble/post-quantum/ml-kem.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.disable('x-powered-by');

const encoder = new TextEncoder();
const toBase64 = (bytes: Uint8Array) => Buffer.from(bytes).toString('base64');
const signingKeys = ml_dsa65.keygen();
const kemKeys = ml_kem768.keygen();
const telemetryKeyId = `line-${Date.now().toString(36)}`;

function createTelemetry() {
  return {
    keyId: telemetryKeyId,
    sequence: Date.now(),
    trainId: 'enchanted-line-01',
    status: 'in-transit',
    speedKph: 82,
    routeProgress: 0.42,
    issuedAt: new Date().toISOString(),
  };
}

// 1. Set Security HTTP Headers
app.use(helmet());

// 2. Strict CORS Configuration
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:8443')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origin is not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST'],
}));

// 3. Rate Limiting (Prevents Brute-Force & Denial of Service)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to API routes
app.use('/api/', apiLimiter);

// 4. Payload Size Limit (Prevents large payload crashes)
app.use(express.json({ limit: '10kb' }));

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/pqc/status', (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store');
  const { cipherText, sharedSecret } = ml_kem768.encapsulate(kemKeys.publicKey);
  const recoveredSecret = ml_kem768.decapsulate(cipherText, kemKeys.secretKey);
  const kemVerified = Buffer.from(sharedSecret).equals(Buffer.from(recoveredSecret));

  res.status(200).json({
    authenticated: kemVerified,
    keyExchange: 'ML-KEM-768',
    signature: 'ML-DSA-65',
    publicKey: toBase64(signingKeys.publicKey),
  });
});

app.get('/api/telemetry', (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store');
  const telemetry = createTelemetry();
  const message = encoder.encode(JSON.stringify(telemetry));
  const signature = ml_dsa65.sign(message, signingKeys.secretKey);

  res.status(200).json({
    telemetry,
    signature: toBase64(signature),
    algorithm: 'ML-DSA-65',
  });
});

app.listen(PORT, () => {
  console.log(`🚂 Secure server running on http://localhost:${PORT}`);
});