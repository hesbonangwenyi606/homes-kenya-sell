import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import propertiesRouter from './routes/properties';
import inquiriesRouter from './routes/inquiries';
import leadsRouter from './routes/leads';
import newsletterRouter from './routes/newsletter';
import adminRouter, { adminLogin } from './routes/admin';

const app = express();
const PORT = process.env.PORT ?? 3001;

// ── Middleware ─────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:8080')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman) or matching origins
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      // For unrecognised origins, still allow but without credentials
      callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/properties', propertiesRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/newsletter', newsletterRouter);

// Admin login is public; everything else under /api/admin requires JWT
app.post('/api/admin/login', adminLogin);
app.use('/api/admin', adminRouter);

// ── Error handler ──────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`   Database: SQLite (backend/data/hemaprin.db)\n`);
});

export default app;
