import { Router, Request, Response } from 'express';
import db from '../lib/db';

const router = Router();

router.get('/faqs', (_req: Request, res: Response) => {
  const items = db.get('faq_items').orderBy('order', 'asc').value();
  res.json({ data: items });
});

router.get('/blog', (req: Request, res: Response) => {
  let posts = db.get('blog_posts').orderBy('created_at', 'desc').value();
  posts = posts.filter((p) => p.published);
  res.json({ data: posts });
});

router.get('/careers', (_req: Request, res: Response) => {
  const jobs = db.get('job_openings').filter((j) => j.active).orderBy('created_at', 'desc').value();
  res.json({ data: jobs });
});

export default router;
