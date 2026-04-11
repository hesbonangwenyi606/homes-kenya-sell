import { Router, Response } from 'express';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import db, { Inquiry } from '../lib/db';
import { optionalAuth, requireAuth, AuthRequest } from '../middleware/auth';

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

router.post('/', optionalAuth, (req: AuthRequest, res: Response) => {
  const parsed = inquirySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }

  const now = new Date().toISOString();
  const inquiry: Inquiry = {
    id: uuid(),
    ...parsed.data,
    agent_id: parsed.data.agent_id ?? null,
    agent_name: parsed.data.agent_name ?? null,
    inquirer_phone: parsed.data.inquirer_phone ?? null,
    message: parsed.data.message ?? null,
    status: 'pending',
    created_at: now,
    updated_at: now,
  };

  db.get('inquiries').push(inquiry).write();
  res.status(201).json({ data: inquiry });
});

// GET own inquiries by email
router.get('/', requireAuth, (req: AuthRequest, res: Response) => {
  const data = db.get('inquiries')
    .filter((i) => i.inquirer_email.toLowerCase() === req.userEmail!)
    .orderBy('created_at', 'desc')
    .value();
  res.json({ data });
});

router.delete('/:id', requireAuth, (req: AuthRequest, res: Response) => {
  db.get('inquiries')
    .remove((i) => i.id === req.params.id && i.inquirer_email.toLowerCase() === req.userEmail!)
    .write();
  res.status(204).send();
});

export default router;
