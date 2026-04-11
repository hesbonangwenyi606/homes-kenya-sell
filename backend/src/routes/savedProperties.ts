import { Router, Response } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const saveSchema = z.object({
  property_id: z.number().int().positive(),
  property_title: z.string().min(1),
  property_location: z.string().min(1),
  property_price: z.number().int().positive(),
  property_type: z.string().min(1),
  property_image: z.string().min(1),
  property_bedrooms: z.number().int().min(0).default(0),
  property_bathrooms: z.number().int().min(0).default(0),
  property_sqft: z.number().int().min(0).default(0),
});

// GET /api/saved-properties — authenticated users only
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from('saved_properties')
    .select('*')
    .eq('user_id', req.user!.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch saved properties error:', error);
    res.status(500).json({ error: 'Failed to fetch saved properties' });
    return;
  }

  res.json({ data });
});

// POST /api/saved-properties — save a property
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const parsed = saveSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }

  const payload = { ...parsed.data, user_id: req.user!.id };

  const { data, error } = await supabaseAdmin
    .from('saved_properties')
    .insert(payload)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      // unique constraint — already saved
      res.status(409).json({ error: 'Property already saved' });
      return;
    }
    console.error('Save property error:', error);
    res.status(500).json({ error: 'Failed to save property' });
    return;
  }

  res.status(201).json({ data });
});

// DELETE /api/saved-properties/:propertyId — unsave a property
router.delete('/:propertyId', requireAuth, async (req: AuthRequest, res: Response) => {
  const { error } = await supabaseAdmin
    .from('saved_properties')
    .delete()
    .eq('user_id', req.user!.id)
    .eq('property_id', Number(req.params.propertyId));

  if (error) {
    console.error('Delete saved property error:', error);
    res.status(500).json({ error: 'Failed to unsave property' });
    return;
  }

  res.status(204).send();
});

export default router;
