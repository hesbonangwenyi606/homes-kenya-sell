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

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  description: string;
  requirements: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AboutTeamMember {
  id: string;
  name: string;
  role: string;
  location: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface AboutValue {
  id: string;
  icon_name: string;
  title: string;
  desc: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface AboutStat {
  id: string;
  value: string;
  label: string;
  order: number;
}

interface Schema {
  properties: DBProperty[];
  leads: Lead[];
  inquiries: Inquiry[];
  newsletter: Subscriber[];
  faq_items: FaqItem[];
  blog_posts: BlogPost[];
  job_openings: JobOpening[];
  about_team: AboutTeamMember[];
  about_values: AboutValue[];
  about_stats: AboutStat[];
  about_story: string[];
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

const SEED_FAQS: FaqItem[] = [
  { id: 'faq-1', question: 'How do I buy a property through Hemaprin Homes?', answer: 'Browse our listings, find a property you love, and click "Inquire Now". Our agents will contact you within 24 hours to guide you through the entire purchase process, from viewing to title deed transfer.', order: 1, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 'faq-2', question: 'Are all your property listings verified?', answer: 'Yes. Every property listed on Hemaprin Homes goes through a rigorous verification process. We verify title deeds, conduct site visits, and confirm ownership before any listing goes live on our platform.', order: 2, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 'faq-3', question: 'What areas do you cover?', answer: 'We cover major towns and cities across Kenya including Nairobi, Kiambu, Thika, Limuru, Ruiru, Juja, Karen, Muthaiga, and many more. Our coverage is constantly expanding across Kenya\'s key growth corridors.', order: 3, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 'faq-4', question: 'Do you help with financing and mortgages?', answer: 'Yes, we partner with leading banks and SACCOs to connect buyers with competitive mortgage rates. Our team guides you through the entire financing process from application to approval.', order: 4, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 'faq-5', question: 'How do I schedule a property viewing?', answer: 'Click "Inquire Now" on any listing or call us at +254 725 604 549. Our agents will arrange a convenient viewing time. We also offer virtual tours for select properties.', order: 5, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 'faq-6', question: 'What legal fees are involved in purchasing property?', answer: 'Typical costs include stamp duty (2-4% of property value), legal/conveyancing fees (0.5-1%), land search fees, and registration fees. Our agents provide a full cost breakdown before you commit so there are no surprises.', order: 6, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 'faq-7', question: 'Can I sell my property through Hemaprin Homes?', answer: 'Absolutely. Contact us for a free property valuation and market assessment. We list your property on our platform, market it across our digital channels, and handle all buyer inquiries professionally on your behalf.', order: 7, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 'faq-8', question: 'What types of properties do you list?', answer: 'We list houses, apartments, bungalows, maisonettes, townhouses, land (residential and commercial), and investment properties across Kenya\'s major urban and peri-urban areas.', order: 8, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
];

const SEED_BLOG_POSTS: BlogPost[] = [
  { id: 'blog-1', title: 'Top 5 Neighborhoods to Invest in Nairobi in 2026', excerpt: "Nairobi's property market continues to show strong growth. Here are the top neighborhoods where smart investors are putting their money this year.", content: "Nairobi remains East Africa's most dynamic real estate market. With infrastructure development accelerating and population growth continuing, certain neighborhoods stand out as prime investment targets.\n\n**Karen & Lang'ata** — This leafy suburb attracts high-net-worth buyers consistently. Proximity to Wilson Airport, international schools, and Nairobi National Park keeps demand high. Prices have appreciated 12% year-on-year.\n\n**Westlands** — The commercial hub is evolving into a mixed-use powerhouse. New residential towers, boutique hotels, and grade-A office space make this ideal for investors targeting rental income.\n\n**Ruiru** — With the Thika Superhighway making commutes manageable, Ruiru offers affordable entry points with strong capital growth potential. Land prices have tripled over the past five years.\n\n**Kitengela** — South of Nairobi, Kitengela has emerged as a hotbed of middle-income housing. Lower land prices attract first-time buyers and investors looking for strong appreciation.\n\n**Gigiri & Runda** — The diplomatic belt offers premium rental yields. Proximity to UN headquarters and embassies sustains high demand from expatriate tenants year-round.", author: 'Henry Njenga', category: 'Market Insights', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572279611_caa18220.jpg', published: true, created_at: '2026-01-15T00:00:00.000Z', updated_at: '2026-01-15T00:00:00.000Z' },
  { id: 'blog-2', title: "First-Time Buyer's Complete Guide to Property in Kenya", excerpt: "Navigating Kenya's real estate market for the first time? This guide walks you through every step — from budget planning to title deed transfer.", content: "Buying your first property in Kenya is one of the most significant financial decisions you will make. Understanding the process helps you avoid costly mistakes.\n\n**Step 1: Define Your Budget** — Before viewing a single property, know your numbers. Factor in purchase price, stamp duty (2-4%), legal fees (0.5-1%), and moving costs. Get mortgage pre-approval if financing.\n\n**Step 2: Choose the Right Location** — Location determines both your quality of life and investment return. Consider proximity to work, schools, healthcare, and transport links.\n\n**Step 3: Engage a Reputable Agent** — Work with a registered agent. They provide access to verified listings, market knowledge, and negotiation support.\n\n**Step 4: Conduct Due Diligence** — Verify the title deed at the Lands Registry, check for caveats or encumbrances, confirm accurate land size, and check land rates compliance.\n\n**Step 5: Sign the Sale Agreement** — Your lawyer reviews the sale agreement. Pay a 10% deposit on signing. Balance is paid on completion — typically 30-90 days later.\n\n**Step 6: Transfer and Registration** — Title transfer is filed at the Ministry of Lands. Stamp duty is paid and the new title deed is issued in your name within 30-60 days.", author: 'Grace Wanjiru', category: "Buyer's Guide", image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572312388_e8be063b.png', published: true, created_at: '2026-02-10T00:00:00.000Z', updated_at: '2026-02-10T00:00:00.000Z' },
  { id: 'blog-3', title: 'Land vs. House: Which Investment Makes More Sense?', excerpt: "Should you buy raw land or a ready house? We break down the pros, cons, and return potential of each investment type in Kenya's current market.", content: "The land vs. house debate is one of the most common questions we receive. Both have merit, but your choice should align with your investment horizon and cash flow needs.\n\n**Buying Land: The Case For It** — Land appreciates faster in emerging corridors. No depreciation, no maintenance costs, and minimal ongoing expenses. In Ruiru, Juja, and Kitengela, land prices have increased 200-400% over the past decade.\n\n**The Downsides of Land** — Land generates no rental income. It ties up capital with zero cash flow. You also face risks of encroachment and the complexity of Kenya's land registry processes.\n\n**Buying a House: The Case For It** — A house generates immediate rental income, offsetting mortgage costs. Residential property in Nairobi yields 5-8% annually in rental income, with capital appreciation on top.\n\n**The Downsides of Houses** — Maintenance costs, tenant management, and vacancy periods eat into returns. Houses also depreciate structurally, requiring ongoing investment.\n\n**Our Verdict** — For long-term wealth with a 10+ year horizon: land wins. For regular passive income: a house or apartment is superior. Many savvy investors buy both — land for appreciation and residential units for cash flow.", author: 'Peter Mwangi', category: 'Investment Tips', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572537104_c4b7e998.jpg', published: true, created_at: '2026-03-05T00:00:00.000Z', updated_at: '2026-03-05T00:00:00.000Z' },
  { id: 'blog-4', title: 'Understanding Property Valuation in Kenya', excerpt: "How is a property's market value determined? Understanding valuation methodology helps you buy smart and negotiate with confidence.", content: "Property valuation in Kenya follows internationally recognised methodologies adapted for local market conditions. Understanding how valuation works gives you a significant advantage.\n\n**Comparison Method** — The most common approach: valuers compare your property against recent sales of similar properties in the same area. Location, size, age, condition, and amenities are weighted to arrive at market value.\n\n**Income Capitalisation Method** — Used primarily for commercial and investment properties, this method calculates value based on net income generated. A shop earning KES 150,000/month may be valued at a multiple of that annual income.\n\n**Cost Approach** — The valuer estimates what it would cost to replace the building at current construction rates, then depreciates for age and condition. Often used for unique or special-purpose properties.\n\n**Factors That Increase Value** — Infrastructure improvements, proximity to amenities, good title deed status, high-demand locations, and quality finishes all push valuations higher.\n\n**Getting a Fair Valuation** — Always engage a registered valuer from the Institution of Surveyors of Kenya (ISK). At Hemaprin Homes, our in-house valuers provide free market assessments for all listed properties.", author: 'Peter Mwangi', category: 'Market Insights', image: 'https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572318206_023f5e8c.png', published: true, created_at: '2026-03-20T00:00:00.000Z', updated_at: '2026-03-20T00:00:00.000Z' },
];

const SEED_JOBS: JobOpening[] = [
  { id: 'job-1', title: 'Real Estate Sales Agent', department: 'Sales', location: 'Nairobi', type: 'full-time', description: 'We are looking for driven, client-focused sales agents to join our growing Nairobi team. You will manage client relationships, conduct property viewings, negotiate deals, and close transactions. This role offers uncapped commission on top of a competitive base salary.', requirements: ['Minimum 2 years of real estate sales experience', 'Excellent communication and negotiation skills', 'Valid driving licence and own reliable transport', 'Self-motivated with a proven track record of hitting targets', 'Strong knowledge of the Nairobi property market'], active: true, created_at: '2026-03-01T00:00:00.000Z', updated_at: '2026-03-01T00:00:00.000Z' },
  { id: 'job-2', title: 'Property Valuer', department: 'Valuations', location: 'Kiambu / Thika', type: 'full-time', description: 'We need an experienced, ISK-registered property valuer to join our central Kenya team covering Kiambu and Thika counties. You will conduct site inspections, prepare valuation reports for mortgage purposes, and advise clients on fair market values.', requirements: ['Registered member of the Institution of Surveyors of Kenya (ISK)', 'Minimum 3 years post-qualification experience', 'Strong report writing and analytical skills', 'Familiar with Central Kenya property market dynamics', 'Proficiency in standard valuation software'], active: true, created_at: '2026-03-01T00:00:00.000Z', updated_at: '2026-03-01T00:00:00.000Z' },
  { id: 'job-3', title: 'Digital Marketing Specialist', department: 'Marketing', location: 'Nairobi (Hybrid)', type: 'full-time', description: "Help us grow Hemaprin Homes into Kenya's most recognised real estate brand. You will manage our social media channels, run paid advertising campaigns, produce property content, and analyse performance metrics to drive qualified leads.", requirements: ['3+ years of digital marketing experience', 'Proficiency in Meta Ads, Google Ads, and SEO', 'Experience with real estate or property brands is a plus', 'Strong copywriting and visual content creation skills', 'Data-driven mindset with proficiency in Google Analytics'], active: true, created_at: '2026-03-15T00:00:00.000Z', updated_at: '2026-03-15T00:00:00.000Z' },
];

const SEED_ABOUT_TEAM: AboutTeamMember[] = [
  { id: 'team-1', name: 'Henry Njenga', role: 'Founder & CEO', location: 'Nairobi', order: 1, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 'team-2', name: 'Grace Wanjiru', role: 'Head of Sales', location: 'Kiambu', order: 2, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 'team-3', name: 'Peter Mwangi', role: 'Property Valuer', location: 'Thika', order: 3, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 'team-4', name: 'Alice Kamau', role: 'Client Relations', location: 'Nairobi', order: 4, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
];

const SEED_ABOUT_VALUES: AboutValue[] = [
  { id: 'val-1', icon_name: 'Shield', title: 'Integrity', desc: 'We operate with full transparency. Every listing is verified and every transaction is handled with honesty.', order: 1, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 'val-2', icon_name: 'Users', title: 'Client First', desc: 'Your property goals drive everything we do. We listen, advise, and deliver results that matter to you.', order: 2, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 'val-3', icon_name: 'TrendingUp', title: 'Market Expertise', desc: 'Years of experience across Nairobi, Kiambu, Thika, and beyond means we know the market inside out.', order: 3, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
  { id: 'val-4', icon_name: 'Award', title: 'Quality Listings', desc: "We curate only the best properties — residential, commercial, and land — across Kenya's key growth corridors.", order: 4, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
];

const SEED_ABOUT_STATS: AboutStat[] = [
  { id: 'stat-1', value: '500+', label: 'Properties Listed', order: 1 },
  { id: 'stat-2', value: '900+', label: 'Happy Clients', order: 2 },
  { id: 'stat-3', value: '47', label: 'Cities Covered', order: 3 },
  { id: 'stat-4', value: '150+', label: 'Expert Agents', order: 4 },
];

const SEED_ABOUT_STORY: string[] = [
  'Hemaprin Homes was founded with a simple mission: make property buying, selling, and investment in Kenya simple, transparent, and trustworthy. We started in Nairobi and have since grown to cover major towns across Central Kenya and beyond.',
  'With a portfolio of over 500 verified listings and a team of seasoned agents, we have helped hundreds of families and investors find the perfect property. From studio apartments in Ruiru to prime land in Thika and luxury villas in Karen, our listings span every budget and lifestyle.',
  'Based at Arcade House, 1st Floor, Nairobi, we combine local market knowledge with modern technology to give you the best property search experience in Kenya.',
];

db.defaults({
  properties: SEED_PROPERTIES,
  leads: [],
  inquiries: [],
  newsletter: [],
  faq_items: SEED_FAQS,
  blog_posts: SEED_BLOG_POSTS,
  job_openings: SEED_JOBS,
  about_team: SEED_ABOUT_TEAM,
  about_values: SEED_ABOUT_VALUES,
  about_stats: SEED_ABOUT_STATS,
  about_story: SEED_ABOUT_STORY,
}).write();

export default db;
