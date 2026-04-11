import { Router, Response } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const inquirySchema = z.object({
  property_id: z.number().int().positive(),
  property_title: z.string().min(1),
  property_location: z.string().min(1),
  agent_id: z.number().int().positive().optional(),
  agent_name: z.string().optional(),
  inquirer_name: z.string().min(1),
  inquirer_email: z.string().email(),
  inquirer_phone: z.string().optional(),
  message: z.string().optional(),
});

// POST /api/inquiries — anyone can submit an inquiry
router.post('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  const parsed = inquirySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }

  const payload = {
    ...parsed.data,
    user_id: req.user?.id ?? null,
  };

  const { data, error } = await supabaseAdmin
    .from('property_inquiries')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Insert inquiry error:', error);
    res.status(500).json({ error: 'Failed to submit inquiry' });
    return;
  }

  res.status(201).json({ data });
});

// GET /api/inquiries — authenticated users see their own inquiries
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from('property_inquiries')
    .select('*')
    .eq('user_id', req.user!.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch inquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
    return;
  }

  res.json({ data });
});

// DELETE /api/inquiries/:id — owner only
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  const { error } = await supabaseAdmin
    .from('property_inquiries')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user!.id);

  if (error) {
    console.error('Delete inquiry error:', error);
    res.status(500).json({ error: 'Failed to delete inquiry' });
    return;
  }

  res.status(204).send();
});

export default router;
