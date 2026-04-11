import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase';
import { requireAdmin } from '../middleware/adminAuth';

const router = Router();

// All admin routes require admin auth
router.use(requireAdmin);

// ── POST /api/admin/login ─────────────────────────────────────────────────────
// Exchange email + password for a Supabase session (access_token + refresh_token).
// The client then passes access_token as Bearer token on subsequent requests.
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// This route intentionally skips requireAdmin — it IS the login endpoint.
// We re-export it as a standalone handler mounted before the router.use(requireAdmin) guard.
export async function adminLogin(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'email and password are required' });
    return;
  }

  const { email, password } = parsed.data;

  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase());

  if (!adminEmails.includes(email.toLowerCase())) {
    res.status(403).json({ error: 'Not an admin account' });
    return;
  }

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    res.status(401).json({ error: error?.message ?? 'Invalid credentials' });
    return;
  }

  res.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
    user: { id: data.user.id, email: data.user.email },
  });
}

// ── GET /api/admin/stats ──────────────────────────────────────────────────────
router.get('/stats', async (_req, res: Response) => {
  const [leads, inquiries, newsletter] = await Promise.all([
    supabaseAdmin.from('contact_leads').select('status', { count: 'exact', head: false }),
    supabaseAdmin.from('property_inquiries').select('status', { count: 'exact', head: false }),
    supabaseAdmin.from('newsletter_subscribers').select('status', { count: 'exact', head: false }),
  ]);

  const countByStatus = (rows: { status: string }[] | null) =>
    (rows ?? []).reduce<Record<string, number>>((acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    }, {});

  res.json({
    leads: {
      total: leads.data?.length ?? 0,
      byStatus: countByStatus(leads.data),
    },
    inquiries: {
      total: inquiries.data?.length ?? 0,
      byStatus: countByStatus(inquiries.data),
    },
    newsletter: {
      total: newsletter.data?.length ?? 0,
      byStatus: countByStatus(newsletter.data),
    },
  });
});

// ── Contact Leads ─────────────────────────────────────────────────────────────

// GET /api/admin/leads?status=new&page=1&limit=20
router.get('/leads', async (req: Request, res: Response) => {
  const { status, page = '1', limit = '20' } = req.query;
  const from = (Number(page) - 1) * Number(limit);
  const to = from + Number(limit) - 1;

  let query = supabaseAdmin
    .from('contact_leads')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status && typeof status === 'string') query = query.eq('status', status);

  const { data, error, count } = await query;

  if (error) {
    res.status(500).json({ error: 'Failed to fetch leads' });
    return;
  }

  res.json({ data, total: count, page: Number(page), limit: Number(limit) });
});

// GET /api/admin/leads/:id
router.get('/leads/:id', async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from('contact_leads')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !data) {
    res.status(404).json({ error: 'Lead not found' });
    return;
  }

  res.json({ data });
});

// PATCH /api/admin/leads/:id — update status
const leadStatusSchema = z.object({
  status: z.enum(['new', 'assigned', 'contacted', 'qualified', 'closed']),
});

router.patch('/leads/:id', async (req: Request, res: Response) => {
  const parsed = leadStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid status value', details: parsed.error.flatten() });
    return;
  }

  const { data, error } = await supabaseAdmin
    .from('contact_leads')
    .update({ status: parsed.data.status })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: 'Failed to update lead' });
    return;
  }

  res.json({ data });
});

// DELETE /api/admin/leads/:id
router.delete('/leads/:id', async (req: Request, res: Response) => {
  const { error } = await supabaseAdmin
    .from('contact_leads')
    .delete()
    .eq('id', req.params.id);

  if (error) {
    res.status(500).json({ error: 'Failed to delete lead' });
    return;
  }

  res.status(204).send();
});

// ── Property Inquiries ────────────────────────────────────────────────────────

// GET /api/admin/inquiries?status=pending&page=1&limit=20
router.get('/inquiries', async (req: Request, res: Response) => {
  const { status, page = '1', limit = '20' } = req.query;
  const from = (Number(page) - 1) * Number(limit);
  const to = from + Number(limit) - 1;

  let query = supabaseAdmin
    .from('property_inquiries')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status && typeof status === 'string') query = query.eq('status', status);

  const { data, error, count } = await query;

  if (error) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
    return;
  }

  res.json({ data, total: count, page: Number(page), limit: Number(limit) });
});

// PATCH /api/admin/inquiries/:id — update status
const inquiryStatusSchema = z.object({
  status: z.enum(['pending', 'contacted', 'resolved', 'closed']),
});

router.patch('/inquiries/:id', async (req: Request, res: Response) => {
  const parsed = inquiryStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid status value', details: parsed.error.flatten() });
    return;
  }

  const { data, error } = await supabaseAdmin
    .from('property_inquiries')
    .update({ status: parsed.data.status })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: 'Failed to update inquiry' });
    return;
  }

  res.json({ data });
});

// ── Newsletter Subscribers ────────────────────────────────────────────────────

// GET /api/admin/newsletter?status=active&page=1&limit=20
router.get('/newsletter', async (req: Request, res: Response) => {
  const { status, page = '1', limit = '20' } = req.query;
  const from = (Number(page) - 1) * Number(limit);
  const to = from + Number(limit) - 1;

  let query = supabaseAdmin
    .from('newsletter_subscribers')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status && typeof status === 'string') query = query.eq('status', status);

  const { data, error, count } = await query;

  if (error) {
    res.status(500).json({ error: 'Failed to fetch subscribers' });
    return;
  }

  res.json({ data, total: count, page: Number(page), limit: Number(limit) });
});

export default router;
