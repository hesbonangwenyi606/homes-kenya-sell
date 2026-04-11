import { Router, Request, Response } from 'express';

const router = Router();

// Static property data (mirrors src/data/properties.ts)
const properties = [
  { id: 1, title: 'Modern Villa in Karen', location: 'Nairobi', price: 85000000, bedrooms: 5, bathrooms: 4, landSize: 0.38, type: 'house', image: '/heme%20sales%201.jpeg', featured: true },
  { id: 2, title: 'Luxury Apartment in Westlands', location: 'Juja, Nairobi', price: 25000000, bedrooms: 3, bathrooms: 2, landSize: 0.20, type: 'apartment', image: '/home%20sales%202.jpeg', featured: true },
  { id: 3, title: 'Beachfront Bungalow', location: 'Limuru', price: 45000000, bedrooms: 4, bathrooms: 3, landSize: 0.35, type: 'bungalow', image: '/home%20sales%203.jpeg', featured: true },
  { id: 4, title: 'Prime Land in Thika', location: 'Thika', price: 8500000, bedrooms: 0, bathrooms: 0, landSize: 0.10, type: 'land', image: '/home%20sales%204.jpeg' },
  { id: 5, title: 'Executive Townhouse', location: 'Kiambu', price: 55000000, bedrooms: 4, bathrooms: 4, landSize: 0.04, type: 'house', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572309373_2d5016eb.png' },
  { id: 6, title: 'Studio Apartment', location: 'Ruiru, Nairobi', price: 8500000, bedrooms: 1, bathrooms: 1, landSize: 0.01, type: 'apartment', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572336486_8e5b5a8a.jpg' },
  { id: 7, title: 'Family Home in Juja', location: 'Juja, Nairobi', price: 120000000, bedrooms: 6, bathrooms: 5, landSize: 0.07, type: 'house', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572318206_023f5e8c.png', featured: true },
  { id: 8, title: 'Thika Bungalow', location: 'Thika', price: 35000000, bedrooms: 3, bathrooms: 2, landSize: 0.03, type: 'bungalow', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572396026_f217c0cf.png' },
  { id: 9, title: 'Agricultural Land', location: 'Limuru', price: 15000000, bedrooms: 0, bathrooms: 0, landSize: 0.40, type: 'land', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572537104_c4b7e998.jpg' },
  { id: 10, title: 'Penthouse Suite', location: 'Thika, Nairobi', price: 75000000, bedrooms: 4, bathrooms: 3, landSize: 0.04, type: 'apartment', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572337998_a8d95d1c.jpg' },
  { id: 11, title: 'Maisonette in Limuru', location: 'Limuru, Nairobi', price: 65000000, bedrooms: 5, bathrooms: 4, landSize: 0.04, type: 'house', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572312388_e8be063b.png' },
  { id: 12, title: 'Kiambu Bungalow', location: 'Kiambu', price: 28000000, bedrooms: 3, bathrooms: 2, landSize: 0.02, type: 'bungalow', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572445533_1fb837cc.png' },
  { id: 13, title: 'Commercial Plot', location: 'Thika, Kiambu', price: 25000000, bedrooms: 0, bathrooms: 0, landSize: 0.20, type: 'land', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572539941_9a42a827.jpg' },
  { id: 14, title: 'Modern Duplex', location: 'Parklands, Nairobi', price: 42000000, bedrooms: 4, bathrooms: 3, landSize: 0.03, type: 'apartment', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572366773_6b0958d7.png' },
  { id: 15, title: 'Elegant Mansion', location: 'Muthaiga, Nairobi', price: 250000000, bedrooms: 7, bathrooms: 6, landSize: 0.11, type: 'house', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572315012_4afb39ae.png', featured: true },
  { id: 16, title: 'Kiambu Family Home', location: 'Kiambu', price: 38000000, bedrooms: 4, bathrooms: 3, landSize: 0.03, type: 'bungalow', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572400305_18d6ab28.png' },
  { id: 17, title: 'Residential Plot', location: 'Ruiru, Kiambu', price: 6500000, bedrooms: 0, bathrooms: 0, landSize: 0.05, type: 'land', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572543971_4ccc1109.png' },
  { id: 18, title: 'Serviced Apartment', location: 'Thika', price: 18000000, bedrooms: 2, bathrooms: 2, landSize: 0.01, type: 'apartment', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572337743_f73af543.jpg' },
];

// GET /api/properties
// Query params: location, type, minPrice, maxPrice, minBedrooms, featured
router.get('/', (req: Request, res: Response) => {
  let results = [...properties];

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
  const property = properties.find((p) => p.id === Number(req.params.id));
  if (!property) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }
  res.json({ data: property });
});

export default router;
