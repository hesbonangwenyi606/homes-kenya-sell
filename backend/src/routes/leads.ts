import { Router, Response } from 'express';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import db, { Lead } from '../lib/db';
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

router.post('/', optionalAuth, (req: AuthRequest, res: Response) => {
  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }

  const now = new Date().toISOString();
  const lead: Lead = {
    id: uuid(),
    ...parsed.data,
    preferred_locations: parsed.data.preferred_locations ?? null,
    property_type: parsed.data.property_type ?? null,
    budget_min: parsed.data.budget_min ?? null,
    budget_max: parsed.data.budget_max ?? null,
    bedrooms: parsed.data.bedrooms ?? null,
    timeline: parsed.data.timeline ?? null,
    preferred_contact_method: parsed.data.preferred_contact_method ?? null,
    message: parsed.data.message ?? null,
    source: 'website_contact_form',
    status: 'new',
    created_at: now,
    updated_at: now,
  };

  db.get('leads').push(lead).write();
  res.status(201).json({ data: lead });
});

export default router;
