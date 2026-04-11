import { Router, Response } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase';
import { optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const leadSchema = z.object({
  full_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  purpose: z.enum(['buy', 'rent', 'invest']),
  preferred_locations: z.string().optional(),
  property_type: z.string().optional(),
  budget_min: z.number().int().positive().optional(),
  budget_max: z.number().int().positive().optional(),
  bedrooms: z.number().int().min(0).optional(),
  timeline: z.string().optional(),
  preferred_contact_method: z.enum(['phone', 'email', 'whatsapp']).optional(),
  message: z.string().optional(),
});

// POST /api/leads — public endpoint
router.post('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }

  const payload = {
    ...parsed.data,
    user_id: req.user?.id ?? null,
    source: 'website_contact_form',
  };

  const { data, error } = await supabaseAdmin
    .from('contact_leads')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Insert lead error:', error);
    res.status(500).json({ error: 'Failed to submit lead' });
    return;
  }

  res.status(201).json({ data });
});

export default router;
