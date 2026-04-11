import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import db from '../lib/db';

const router = Router();
const emailSchema = z.object({ email: z.string().email() });

router.post('/', (req: Request, res: Response) => {
  const parsed = emailSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid email address' });
    return;
  }

  const email = parsed.data.email.trim().toLowerCase();
  const now = new Date().toISOString();
  const existing = db.get('newsletter').find({ email }).value();

  if (existing) {
    db.get('newsletter').find({ email }).assign({ status: 'active', updated_at: now }).write();
  } else {
    db.get('newsletter').push({ id: uuid(), email, status: 'active', source: 'website_footer', created_at: now, updated_at: now }).write();
  }

  const row = db.get('newsletter').find({ email }).value();
  res.status(201).json({ data: row, message: 'Successfully subscribed' });
});

router.delete('/', (req: Request, res: Response) => {
  const parsed = emailSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid email address' });
    return;
  }

  const email = parsed.data.email.trim().toLowerCase();
  db.get('newsletter').find({ email }).assign({ status: 'unsubscribed', updated_at: new Date().toISOString() }).write();
  res.json({ message: 'Successfully unsubscribed' });
});

export default router;
