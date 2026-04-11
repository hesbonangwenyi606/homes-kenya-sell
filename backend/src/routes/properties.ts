import { Router, Request, Response } from 'express';
import db from '../lib/db';

const router = Router();

// GET /api/properties
// Query params: location, type, minPrice, maxPrice, minBedrooms, featured
router.get('/', (req: Request, res: Response) => {
  let results = db.get('properties').value();

  const { location, type, minPrice, maxPrice, minBedrooms, featured } = req.query;

  if (location && typeof location === 'string' && location !== 'All Locations') {
    results = results.filter((p) =>
      p.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  if (type && typeof type === 'string') {
    results = results.filter((p) => p.type === type);
  }

  if (minPrice) {
    results = results.filter((p) => p.price >= Number(minPrice));
  }

  if (maxPrice && Number(maxPrice) !== Infinity) {
    results = results.filter((p) => p.price <= Number(maxPrice));
  }

  if (minBedrooms && Number(minBedrooms) > 0) {
    results = results.filter((p) => p.bedrooms >= Number(minBedrooms));
  }

  if (featured === 'true') {
    results = results.filter((p) => p.featured === true);
  }

  res.json({ data: results, count: results.length });
});

// GET /api/properties/:id
router.get('/:id', (req: Request, res: Response) => {
  const property = db.get('properties').find((p) => p.id === Number(req.params.id)).value();
  if (!property) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }
  res.json({ data: property });
});

export default router;
