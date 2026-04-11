import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';
import fs from 'fs';

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
  leads: Lead[];
  inquiries: Inquiry[];
  newsletter: Subscriber[];
}

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const adapter = new FileSync<Schema>(path.join(dataDir, 'hemaprin.json'));
const db = low(adapter);

db.defaults({ leads: [], inquiries: [], newsletter: [] }).write();

export default db;
