import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase';

const router = Router();

const subscribeSchema = z.object({
  email: z.string().email(),
});

// POST /api/newsletter — public endpoint
router.post('/', async (req: Request, res: Response) => {
  const parsed = subscribeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid email address' });
    return;
  }

  const { email } = parsed.data;

  // Upsert: if the email already exists and is unsubscribed, reactivate it
  const { data, error } = await supabaseAdmin
    .from('newsletter_subscribers')
    .upsert({ email, status: 'active', source: 'website_footer' }, { onConflict: 'email' })
    .select()
    .single();

  if (error) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
    return;
  }

  res.status(201).json({ data, message: 'Successfully subscribed' });
});

// DELETE /api/newsletter — unsubscribe by email
router.delete('/', async (req: Request, res: Response) => {
  const parsed = subscribeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid email address' });
    return;
  }

  const { error } = await supabaseAdmin
    .from('newsletter_subscribers')
    .update({ status: 'unsubscribed' })
    .eq('email', parsed.data.email);

  if (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
    return;
  }

  res.status(200).json({ message: 'Successfully unsubscribed' });
});

export default router;
