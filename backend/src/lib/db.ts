import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';
import fs from 'fs';

export interface DBProperty {
  id: number;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  landSize?: number | null;
  type: 'house' | 'apartment' | 'land' | 'bungalow';
  image: string;
  images?: string[];
  description?: string;
  featured?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  purpose: 'buy' | 'rent' | 'invest';
  preferred_locations?: string | null;
  property_type?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
  bedrooms?: number | null;
  timeline?: string | null;
  preferred_contact_method?: 'phone' | 'email' | 'whatsapp' | null;
  message?: string | null;
  source: string;
  status: 'new' | 'assigned' | 'contacted' | 'qualified' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: string;
  property_id: number;
  property_title: string;
  property_location: string;
  agent_id?: number | null;
  agent_name?: string | null;
  inquirer_name: string;
  inquirer_email: string;
  inquirer_phone?: string | null;
  message?: string | null;
  status: 'pending' | 'contacted' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  source: string;
  created_at: string;
  updated_at: string;
}

interface Schema {
  properties: DBProperty[];
  leads: Lead[];
  inquiries: Inquiry[];
  newsletter: Subscriber[];
}

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const adapter = new FileSync<Schema>(path.join(dataDir, 'hemaprin.json'));
const db = low(adapter);

const SEED_PROPERTIES: DBProperty[] = [
  { id: 1, title: 'Modern Villa in Karen', location: 'Nairobi', price: 85000000, bedrooms: 5, bathrooms: 4, landSize: 0.38, type: 'house', image: '/heme%20sales%201.jpeg', featured: true, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 2, title: 'Luxury Apartment in Westlands', location: 'Juja, Nairobi', price: 25000000, bedrooms: 3, bathrooms: 2, landSize: 0.20, type: 'apartment', image: '/home%20sales%202.jpeg', featured: true, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 3, title: 'Beachfront Bungalow', location: 'Limuru', price: 45000000, bedrooms: 4, bathrooms: 3, landSize: 0.35, type: 'bungalow', image: '/home%20sales%203.jpeg', featured: true, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 4, title: 'Prime Land in Thika', location: 'Thika', price: 8500000, bedrooms: 0, bathrooms: 0, landSize: 0.10, type: 'land', image: '/home%20sales%204.jpeg', created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 5, title: 'Executive Townhouse', location: 'Kiambu', price: 55000000, bedrooms: 4, bathrooms: 4, landSize: 0.04, type: 'house', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572309373_2d5016eb.png', created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 6, title: 'Studio Apartment', location: 'Ruiru, Nairobi', price: 8500000, bedrooms: 1, bathrooms: 1, landSize: 0.01, type: 'apartment', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572336486_8e5b5a8a.jpg', created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 7, title: 'Family Home in Juja', location: 'Juja, Nairobi', price: 120000000, bedrooms: 6, bathrooms: 5, landSize: 0.07, type: 'house', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572318206_023f5e8c.png', featured: true, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 8, title: 'Thika Bungalow', location: 'Thika', price: 35000000, bedrooms: 3, bathrooms: 2, landSize: 0.03, type: 'bungalow', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572396026_f217c0cf.png', created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 9, title: 'Agricultural Land', location: 'Limuru', price: 15000000, bedrooms: 0, bathrooms: 0, landSize: 0.40, type: 'land', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572537104_c4b7e998.jpg', created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 10, title: 'Penthouse Suite', location: 'Thika, Nairobi', price: 75000000, bedrooms: 4, bathrooms: 3, landSize: 0.04, type: 'apartment', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572337998_a8d95d1c.jpg', created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 11, title: 'Maisonette in Limuru', location: 'Limuru, Nairobi', price: 65000000, bedrooms: 5, bathrooms: 4, landSize: 0.04, type: 'house', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572312388_e8be063b.png', created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 12, title: 'Kiambu Bungalow', location: 'Kiambu', price: 28000000, bedrooms: 3, bathrooms: 2, landSize: 0.02, type: 'bungalow', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572445533_1fb837cc.png', created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 13, title: 'Commercial Plot', location: 'Thika, Kiambu', price: 25000000, bedrooms: 0, bathrooms: 0, landSize: 0.20, type: 'land', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572539941_9a42a827.jpg', created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 14, title: 'Modern Duplex', location: 'Parklands, Nairobi', price: 42000000, bedrooms: 4, bathrooms: 3, landSize: 0.03, type: 'apartment', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572366773_6b0958d7.png', created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 15, title: 'Elegant Mansion', location: 'Muthaiga, Nairobi', price: 250000000, bedrooms: 7, bathrooms: 6, landSize: 0.11, type: 'house', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572315012_4afb39ae.png', featured: true, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 16, title: 'Kiambu Family Home', location: 'Kiambu', price: 38000000, bedrooms: 4, bathrooms: 3, landSize: 0.03, type: 'bungalow', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572400305_18d6ab28.png', created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 17, title: 'Residential Plot', location: 'Ruiru, Kiambu', price: 6500000, bedrooms: 0, bathrooms: 0, landSize: 0.05, type: 'land', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572543971_4ccc1109.png', created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 18, title: 'Serviced Apartment', location: 'Thika', price: 18000000, bedrooms: 2, bathrooms: 2, landSize: 0.01, type: 'apartment', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572337743_f73af543.jpg', created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
];

db.defaults({ properties: SEED_PROPERTIES, leads: [], inquiries: [], newsletter: [] }).write();

export default db;
