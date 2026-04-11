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
  const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
  const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD ?? '').trim();

  if (email.trim().toLowerCase() !== ADMIN_EMAIL || password.trim() !== ADMIN_PASSWORD) {
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
  const properties = db.get('properties').value();

  res.json({
    properties: { total: properties.length, featured: properties.filter(p => p.featured).length },
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
  const id = String(req.params.id);
  const row = db.get('leads').find((l) => l.id === id).value();
  if (!row) { res.status(404).json({ error: 'Lead not found' }); return; }
  res.json({ data: row });
});

const leadStatusSchema = z.object({ status: z.enum(['new','assigned','contacted','qualified','closed']) });

router.patch('/leads/:id', (req: AdminRequest, res: Response) => {
  const parsed = leadStatusSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid status' }); return; }
  const id = String(req.params.id);

  db.get('leads').find((l) => l.id === id).assign({ status: parsed.data.status, updated_at: new Date().toISOString() }).write();
  res.json({ data: db.get('leads').find((l) => l.id === id).value() });
});

router.delete('/leads/:id', (req: AdminRequest, res: Response) => {
  const id = String(req.params.id);
  db.get('leads').remove((l) => l.id === id).write();
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
  const id = String(req.params.id);

  db.get('inquiries').find((i) => i.id === id).assign({ status: parsed.data.status, updated_at: new Date().toISOString() }).write();
  res.json({ data: db.get('inquiries').find((i) => i.id === id).value() });
});

// ── Properties ────────────────────────────────────────────────────────────────

const propertySchema = z.object({
  title: z.string().min(1),
  location: z.string().min(1),
  price: z.number().positive(),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  landSize: z.number().nullable().optional(),
  type: z.enum(['house', 'apartment', 'land', 'bungalow']),
  image: z.string().min(1),
  images: z.array(z.string()).optional(),
  description: z.string().optional(),
  featured: z.boolean().optional(),
});

router.get('/properties', (req: AdminRequest, res: Response) => {
  const { page = '1', limit = '20' } = req.query as Record<string, string>;
  const pageNum = Number(page), limitNum = Number(limit);
  const rows = db.get('properties').orderBy('id', 'desc').value();
  res.json({ data: rows.slice((pageNum - 1) * limitNum, pageNum * limitNum), total: rows.length, page: pageNum, limit: limitNum });
});

router.post('/properties', (req: AdminRequest, res: Response) => {
  const parsed = propertySchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid data', details: parsed.error.errors }); return; }

  const all = db.get('properties').value();
  const nextId = all.length > 0 ? Math.max(...all.map((p) => p.id)) + 1 : 1;
  const now = new Date().toISOString();
  const property = { id: nextId, ...parsed.data, created_at: now, updated_at: now };

  db.get('properties').push(property).write();
  res.status(201).json({ data: property });
});

router.patch('/properties/:id', (req: AdminRequest, res: Response) => {
  const id = Number(req.params.id);
  const parsed = propertySchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid data' }); return; }

  const existing = db.get('properties').find((p) => p.id === id).value();
  if (!existing) { res.status(404).json({ error: 'Property not found' }); return; }

  db.get('properties').find((p) => p.id === id).assign({ ...parsed.data, updated_at: new Date().toISOString() }).write();
  res.json({ data: db.get('properties').find((p) => p.id === id).value() });
});

router.delete('/properties/:id', (req: AdminRequest, res: Response) => {
  const id = Number(req.params.id);
  db.get('properties').remove((p) => p.id === id).write();
  res.status(204).send();
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
