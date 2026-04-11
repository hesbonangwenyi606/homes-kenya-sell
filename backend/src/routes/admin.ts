import { Router, Request, Response } from 'express';
import { z } from 'zod';
import db from '../lib/db';
import { signAdminToken } from '../lib/jwtAuth';
import { requireAdmin, AdminRequest } from '../middleware/adminAuth';

const router = Router();

// ── POST /api/admin/login ─────────────────────────────────────────────────────
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function adminLogin(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'email and password are required' }); return; }

  const { email, password } = parsed.data;
  const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? '').toLowerCase();
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '';

  if (email.toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  res.json({ access_token: signAdminToken(email), user: { email } });
}

// All routes below require admin JWT
router.use(requireAdmin);

// ── GET /api/admin/stats ──────────────────────────────────────────────────────
router.get('/stats', (_req: AdminRequest, res: Response) => {
  const countByStatus = (rows: { status: string }[]) =>
    rows.reduce<Record<string, number>>((acc, r) => { acc[r.status] = (acc[r.status] ?? 0) + 1; return acc; }, {});

  const leads = db.get('leads').value();
  const inquiries = db.get('inquiries').value();
  const newsletter = db.get('newsletter').value();

  res.json({
    leads: { total: leads.length, byStatus: countByStatus(leads) },
    inquiries: { total: inquiries.length, byStatus: countByStatus(inquiries) },
    newsletter: { total: newsletter.length, byStatus: countByStatus(newsletter) },
  });
});

// ── Contact Leads ─────────────────────────────────────────────────────────────
router.get('/leads', (req: AdminRequest, res: Response) => {
  const { status, page = '1', limit = '20' } = req.query as Record<string, string>;
  const pageNum = Number(page), limitNum = Number(limit);

  let rows = db.get('leads').orderBy('created_at', 'desc').value();
  if (status && status !== 'all') rows = rows.filter(r => r.status === status);

  res.json({ data: rows.slice((pageNum - 1) * limitNum, pageNum * limitNum), total: rows.length, page: pageNum, limit: limitNum });
});

router.get('/leads/:id', (req: AdminRequest, res: Response) => {
  const row = db.get('leads').find({ id: req.params.id }).value();
  if (!row) { res.status(404).json({ error: 'Lead not found' }); return; }
  res.json({ data: row });
});

const leadStatusSchema = z.object({ status: z.enum(['new','assigned','contacted','qualified','closed']) });

router.patch('/leads/:id', (req: AdminRequest, res: Response) => {
  const parsed = leadStatusSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid status' }); return; }

  db.get('leads').find({ id: req.params.id }).assign({ status: parsed.data.status, updated_at: new Date().toISOString() }).write();
  res.json({ data: db.get('leads').find({ id: req.params.id }).value() });
});

router.delete('/leads/:id', (req: AdminRequest, res: Response) => {
  db.get('leads').remove({ id: req.params.id }).write();
  res.status(204).send();
});

// ── Property Inquiries ────────────────────────────────────────────────────────
router.get('/inquiries', (req: AdminRequest, res: Response) => {
  const { status, page = '1', limit = '20' } = req.query as Record<string, string>;
  const pageNum = Number(page), limitNum = Number(limit);

  let rows = db.get('inquiries').orderBy('created_at', 'desc').value();
  if (status && status !== 'all') rows = rows.filter(r => r.status === status);

  res.json({ data: rows.slice((pageNum - 1) * limitNum, pageNum * limitNum), total: rows.length, page: pageNum, limit: limitNum });
});

const inquiryStatusSchema = z.object({ status: z.enum(['pending','contacted','resolved','closed']) });

router.patch('/inquiries/:id', (req: AdminRequest, res: Response) => {
  const parsed = inquiryStatusSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid status' }); return; }

  db.get('inquiries').find({ id: req.params.id }).assign({ status: parsed.data.status, updated_at: new Date().toISOString() }).write();
  res.json({ data: db.get('inquiries').find({ id: req.params.id }).value() });
});

// ── Newsletter ────────────────────────────────────────────────────────────────
router.get('/newsletter', (req: AdminRequest, res: Response) => {
  const { status, page = '1', limit = '20' } = req.query as Record<string, string>;
  const pageNum = Number(page), limitNum = Number(limit);

  let rows = db.get('newsletter').orderBy('created_at', 'desc').value();
  if (status && status !== 'all') rows = rows.filter(r => r.status === status);

  res.json({ data: rows.slice((pageNum - 1) * limitNum, pageNum * limitNum), total: rows.length, page: pageNum, limit: limitNum });
});

export default router;
