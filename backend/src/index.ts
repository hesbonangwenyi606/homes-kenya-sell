import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import propertiesRouter from './routes/properties';
import inquiriesRouter from './routes/inquiries';
import leadsRouter from './routes/leads';
import newsletterRouter from './routes/newsletter';
import savedPropertiesRouter from './routes/savedProperties';
import adminRouter, { adminLogin } from './routes/admin';

const app = express();
const PORT = process.env.PORT ?? 3001;

// ── Middleware ────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:8080')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/properties', propertiesRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/saved-properties', savedPropertiesRouter);

// Admin — login is public, all other /api/admin/* require admin JWT
app.post('/api/admin/login', adminLogin);
app.use('/api/admin', adminRouter);

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
