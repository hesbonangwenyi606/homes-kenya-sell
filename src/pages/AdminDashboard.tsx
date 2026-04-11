import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Home,
  LogOut,
  Users,
  FileText,
  Mail,
  BarChart3,
  Eye,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  Building2,
  Star,
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? '';

// ── Types ──────────────────────────────────────────────────────────────────────

interface AdminSession {
  access_token: string;
  user: { id: string; email: string };
}

interface Stats {
  properties: { total: number; featured: number };
  leads: { total: number; byStatus: Record<string, number> };
  inquiries: { total: number; byStatus: Record<string, number> };
  newsletter: { total: number; byStatus: Record<string, number> };
}

interface AdminProperty {
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
  featured?: boolean;
  created_at: string;
  updated_at: string;
}

const PROPERTY_TYPES = ['house', 'apartment', 'bungalow', 'land'] as const;

const BLANK_PROP_FORM = {
  title: '', location: '', price: '', bedrooms: '0', bathrooms: '0',
  landSize: '', type: 'house' as const, image: '', image2: '', image3: '', featured: false,
};

interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  purpose: string;
  preferred_locations?: string;
  budget_min?: number;
  budget_max?: number;
  status: string;
  created_at: string;
  message?: string;
}

interface Inquiry {
  id: string;
  property_title: string;
  property_location: string;
  inquirer_name: string;
  inquirer_email: string;
  inquirer_phone?: string;
  message?: string;
  status: string;
  created_at: string;
}

interface Subscriber {
  id: string;
  email: string;
  status: string;
  source: string;
  created_at: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

function fmt(n?: number) {
  if (!n) return '—';
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

const LEAD_STATUSES = ['new', 'assigned', 'contacted', 'qualified', 'closed'] as const;
const INQUIRY_STATUSES = ['pending', 'contacted', 'resolved', 'closed'] as const;

const statusColor: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  assigned: 'bg-purple-100 text-purple-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-gray-100 text-gray-600',
  pending: 'bg-orange-100 text-orange-700',
  resolved: 'bg-green-100 text-green-700',
  active: 'bg-emerald-100 text-emerald-700',
  unsubscribed: 'bg-gray-100 text-gray-600',
};

// ── Login screen ───────────────────────────────────────────────────────────────

const LoginScreen: React.FC<{ onLogin: (s: AdminSession) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Login failed'); return; }
      localStorage.setItem('admin_token', data.access_token);
      onLogin({ access_token: data.access_token, user: data.user });
    } catch {
      setError('Cannot connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-gray-900 border-gray-700">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Home className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-white text-xl">Admin Dashboard</CardTitle>
          <p className="text-gray-400 text-sm">Hemaprin Homes</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// ── Stat card ──────────────────────────────────────────────────────────────────

const StatCard: React.FC<{ title: string; value: number; sub?: string; icon: React.ElementType; color: string }> = ({ title, value, sub, icon: Icon, color }) => (
  <Card className="bg-gray-900 border-gray-700">
    <CardContent className="p-5 flex items-center gap-4">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
        {sub && <p className="text-gray-500 text-xs mt-0.5">{sub}</p>}
      </div>
    </CardContent>
  </Card>
);

// ── Pagination ────────────────────────────────────────────────────────────────

const Pagination: React.FC<{ page: number; total: number; limit: number; onChange: (p: number) => void }> = ({ page, total, limit, onChange }) => {
  const pages = Math.ceil(total / limit);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-gray-400 text-sm">
        {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
      </p>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled={page === 1} onClick={() => onChange(page - 1)} className="border-gray-600 text-gray-300">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" disabled={page === pages} onClick={() => onChange(page + 1)} className="border-gray-600 text-gray-300">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

// ── Leads tab ─────────────────────────────────────────────────────────────────

const LeadsTab: React.FC<{ token: string }> = ({ token }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '15' });
    if (statusFilter !== 'all') params.set('status', statusFilter);
    try {
      const res = await fetch(`${API}/api/admin/leads?${params}`, { headers: authHeaders(token) });
      const data = await res.json();
      setLeads(data.data ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [token, page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`${API}/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify({ status }),
    });
    load();
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    await fetch(`${API}/api/admin/leads/${id}`, { method: 'DELETE', headers: authHeaders(token) });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-44 bg-gray-800 border-gray-600 text-gray-200">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="all" className="text-gray-200">All statuses</SelectItem>
            {LEAD_STATUSES.map((s) => <SelectItem key={s} value={s} className="text-gray-200 capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" onClick={load} className="border-gray-600 text-gray-300">
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
        </Button>
      </div>

      <div className="rounded-xl border border-gray-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-800">
            <TableRow className="border-gray-700 hover:bg-gray-800">
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400 hidden md:table-cell">Purpose</TableHead>
              <TableHead className="text-gray-400 hidden lg:table-cell">Budget</TableHead>
              <TableHead className="text-gray-400 hidden xl:table-cell">Date</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center text-gray-500 py-10">Loading…</TableCell></TableRow>
            ) : leads.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-gray-500 py-10">No leads found</TableCell></TableRow>
            ) : leads.map((lead) => (
              <TableRow key={lead.id} className="border-gray-700 hover:bg-gray-800/50">
                <TableCell>
                  <p className="text-white font-medium">{lead.full_name}</p>
                  <p className="text-gray-400 text-xs">{lead.email}</p>
                  <p className="text-gray-400 text-xs">{lead.phone}</p>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="capitalize text-gray-300">{lead.purpose}</span>
                  {lead.preferred_locations && <p className="text-gray-500 text-xs">{lead.preferred_locations}</p>}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-gray-300 text-sm">
                  {lead.budget_min || lead.budget_max
                    ? `${fmt(lead.budget_min)} – ${fmt(lead.budget_max)}`
                    : '—'}
                </TableCell>
                <TableCell className="hidden xl:table-cell text-gray-400 text-sm">{fmtDate(lead.created_at)}</TableCell>
                <TableCell>
                  <Select value={lead.status} onValueChange={(v) => updateStatus(lead.id, v)}>
                    <SelectTrigger className={`w-32 h-7 text-xs border-0 ${statusColor[lead.status] ?? ''}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {LEAD_STATUSES.map((s) => <SelectItem key={s} value={s} className="text-gray-200 capitalize">{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 w-8" onClick={() => deleteLead(lead.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination page={page} total={total} limit={15} onChange={setPage} />
    </div>
  );
};

// ── Inquiries tab ─────────────────────────────────────────────────────────────

const InquiriesTab: React.FC<{ token: string }> = ({ token }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '15' });
    if (statusFilter !== 'all') params.set('status', statusFilter);
    try {
      const res = await fetch(`${API}/api/admin/inquiries?${params}`, { headers: authHeaders(token) });
      const data = await res.json();
      setInquiries(data.data ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [token, page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`${API}/api/admin/inquiries/${id}`, {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify({ status }),
    });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-44 bg-gray-800 border-gray-600 text-gray-200">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="all" className="text-gray-200">All statuses</SelectItem>
            {INQUIRY_STATUSES.map((s) => <SelectItem key={s} value={s} className="text-gray-200 capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" onClick={load} className="border-gray-600 text-gray-300">
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
        </Button>
      </div>

      <div className="rounded-xl border border-gray-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-800">
            <TableRow className="border-gray-700 hover:bg-gray-800">
              <TableHead className="text-gray-400">Inquirer</TableHead>
              <TableHead className="text-gray-400 hidden md:table-cell">Property</TableHead>
              <TableHead className="text-gray-400 hidden lg:table-cell">Message</TableHead>
              <TableHead className="text-gray-400 hidden xl:table-cell">Date</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center text-gray-500 py-10">Loading…</TableCell></TableRow>
            ) : inquiries.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-gray-500 py-10">No inquiries found</TableCell></TableRow>
            ) : inquiries.map((inq) => (
              <TableRow key={inq.id} className="border-gray-700 hover:bg-gray-800/50">
                <TableCell>
                  <p className="text-white font-medium">{inq.inquirer_name}</p>
                  <p className="text-gray-400 text-xs">{inq.inquirer_email}</p>
                  {inq.inquirer_phone && <p className="text-gray-400 text-xs">{inq.inquirer_phone}</p>}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <p className="text-gray-200 text-sm">{inq.property_title}</p>
                  <p className="text-gray-500 text-xs">{inq.property_location}</p>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-gray-400 text-sm max-w-xs truncate">
                  {inq.message ?? '—'}
                </TableCell>
                <TableCell className="hidden xl:table-cell text-gray-400 text-sm">{fmtDate(inq.created_at)}</TableCell>
                <TableCell>
                  <Select value={inq.status} onValueChange={(v) => updateStatus(inq.id, v)}>
                    <SelectTrigger className={`w-32 h-7 text-xs border-0 ${statusColor[inq.status] ?? ''}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {INQUIRY_STATUSES.map((s) => <SelectItem key={s} value={s} className="text-gray-200 capitalize">{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination page={page} total={total} limit={15} onChange={setPage} />
    </div>
  );
};

// ── Properties tab ───────────────────────────────────────────────────────────

const PropertiesTab: React.FC<{ token: string; onStatsRefresh: () => void }> = ({ token, onStatsRefresh }) => {
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminProperty | null>(null);
  const [form, setForm] = useState({ ...BLANK_PROP_FORM });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/properties?page=${page}&limit=15`, { headers: authHeaders(token) });
      const data = await res.json();
      setProperties(data.data ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [token, page]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...BLANK_PROP_FORM });
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (p: AdminProperty) => {
    setEditing(p);
    setForm({
      title: p.title, location: p.location, price: String(p.price),
      bedrooms: String(p.bedrooms), bathrooms: String(p.bathrooms),
      landSize: p.landSize != null ? String(p.landSize) : '',
      type: p.type, image: p.image,
      image2: p.images?.[0] ?? '',
      image3: p.images?.[1] ?? '',
      featured: p.featured ?? false,
    });
    setFormError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.location.trim() || !form.price || !form.image.trim()) {
      setFormError('Title, location, price and image are required.');
      return;
    }
    setSaving(true);
    setFormError('');
    const galleryImages = [form.image2.trim(), form.image3.trim()].filter(Boolean);
    const body = {
      title: form.title.trim(),
      location: form.location.trim(),
      price: Number(form.price),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      landSize: form.landSize ? Number(form.landSize) : null,
      type: form.type,
      image: form.image.trim(),
      images: galleryImages.length > 0 ? galleryImages : undefined,
      featured: form.featured,
    };
    try {
      const url = editing
        ? `${API}/api/admin/properties/${editing.id}`
        : `${API}/api/admin/properties`;
      const res = await fetch(url, {
        method: editing ? 'PATCH' : 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(body),
      });
      if (!res.ok) { const d = await res.json(); setFormError(d.error ?? 'Save failed'); return; }
      setShowForm(false);
      load();
      onStatsRefresh();
    } catch {
      setFormError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`${API}/api/admin/properties/${id}`, { method: 'DELETE', headers: authHeaders(token) });
    load();
    onStatsRefresh();
  };

  const field = (key: keyof typeof form, label: string, type = 'text', placeholder = '') => (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <input
        type={type}
        value={form[key] as string}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button size="sm" onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="w-4 h-4 mr-1.5" /> Add Property
        </Button>
        <Button size="sm" variant="outline" onClick={load} className="border-gray-600 text-gray-300">
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
        </Button>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
          <h3 className="text-white font-semibold">{editing ? 'Edit Property' : 'New Property'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {field('title', 'Title *', 'text', 'Modern Villa in Karen')}
            {field('location', 'Location *', 'text', 'Nairobi')}
            {field('price', 'Price (KES) *', 'number', '85000000')}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as typeof form.type }))}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm"
              >
                {PROPERTY_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            {field('bedrooms', 'Bedrooms', 'number', '3')}
            {field('bathrooms', 'Bathrooms', 'number', '2')}
            {field('landSize', 'Land Size (ha)', 'number', '0.05')}
            <div className="sm:col-span-2 lg:col-span-3">
              {field('image', 'Main Image URL *', 'text', 'https://…')}
            </div>
            {field('image2', 'Gallery Image 2', 'text', 'https://…')}
            {field('image3', 'Gallery Image 3', 'text', 'https://…')}
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                className="w-4 h-4 accent-emerald-500"
              />
              <label htmlFor="featured" className="text-sm text-gray-300">Featured listing</label>
            </div>
          </div>
          {formError && <p className="text-red-400 text-sm">{formError}</p>}
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Property'}
            </Button>
            <Button variant="ghost" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">Cancel</Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-800">
            <TableRow className="border-gray-700 hover:bg-gray-800">
              <TableHead className="text-gray-400">Property</TableHead>
              <TableHead className="text-gray-400 hidden md:table-cell">Price</TableHead>
              <TableHead className="text-gray-400 hidden lg:table-cell">Type</TableHead>
              <TableHead className="text-gray-400 hidden xl:table-cell">Beds/Baths</TableHead>
              <TableHead className="text-gray-400">Featured</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center text-gray-500 py-10">Loading…</TableCell></TableRow>
            ) : properties.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-gray-500 py-10">No properties. Click "Add Property" to start.</TableCell></TableRow>
            ) : properties.map((p) => (
              <TableRow key={p.id} className="border-gray-700 hover:bg-gray-800/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.title} className="w-12 h-9 object-cover rounded-lg flex-shrink-0 bg-gray-700" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    <div>
                      <p className="text-white font-medium text-sm">{p.title}</p>
                      <p className="text-gray-400 text-xs">{p.location}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-emerald-400 font-medium text-sm">
                  {fmt(p.price)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 capitalize">{p.type}</span>
                </TableCell>
                <TableCell className="hidden xl:table-cell text-gray-400 text-sm">
                  {p.bedrooms}bd / {p.bathrooms}ba
                </TableCell>
                <TableCell>
                  {p.featured ? <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> : <span className="text-gray-600 text-xs">—</span>}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(p)} className="h-7 w-7 p-0 text-gray-400 hover:text-white">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(p.id, p.title)} className="h-7 w-7 p-0 text-gray-400 hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination page={page} total={total} limit={15} onChange={setPage} />
    </div>
  );
};

// ── Newsletter tab ────────────────────────────────────────────────────────────

const NewsletterTab: React.FC<{ token: string }> = ({ token }) => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/newsletter?page=${page}&limit=20`, { headers: authHeaders(token) });
      const data = await res.json();
      setSubscribers(data.data ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [token, page]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={load} className="border-gray-600 text-gray-300">
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
        </Button>
      </div>

      <div className="rounded-xl border border-gray-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-800">
            <TableRow className="border-gray-700 hover:bg-gray-800">
              <TableHead className="text-gray-400">Email</TableHead>
              <TableHead className="text-gray-400 hidden md:table-cell">Source</TableHead>
              <TableHead className="text-gray-400 hidden lg:table-cell">Date</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center text-gray-500 py-10">Loading…</TableCell></TableRow>
            ) : subscribers.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center text-gray-500 py-10">No subscribers found</TableCell></TableRow>
            ) : subscribers.map((sub) => (
              <TableRow key={sub.id} className="border-gray-700 hover:bg-gray-800/50">
                <TableCell className="text-white">{sub.email}</TableCell>
                <TableCell className="hidden md:table-cell text-gray-400 text-sm">{sub.source}</TableCell>
                <TableCell className="hidden lg:table-cell text-gray-400 text-sm">{fmtDate(sub.created_at)}</TableCell>
                <TableCell>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[sub.status] ?? ''}`}>
                    {sub.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination page={page} total={total} limit={20} onChange={setPage} />
    </div>
  );
};

// ── Main dashboard ────────────────────────────────────────────────────────────

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Restore token from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      // Validate the token by fetching stats
      fetch(`${API}/api/admin/stats`, { headers: authHeaders(token) })
        .then((res) => {
          if (res.ok) {
            return res.json().then((data) => {
              setStats(data);
              setSession({ access_token: token, user: { id: '', email: ADMIN_EMAIL } });
            });
          }
          localStorage.removeItem('admin_token');
        })
        .catch(() => localStorage.removeItem('admin_token'));
    }
  }, []);

  const handleLogin = async (s: AdminSession) => {
    setSession(s);
    await loadStats(s.access_token);
  };

  const loadStats = async (token: string) => {
    setStatsLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/stats`, { headers: authHeaders(token) });
      const data = await res.json();
      setStats(data);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setSession(null);
    setStats(null);
  };

  if (!session) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top bar */}
      <header className="bg-gray-900 border-b border-gray-700 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Home className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-white">Hemaprin Homes</span>
            <span className="text-gray-400 text-sm ml-2">Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm hidden sm:block">{session.user.email}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white"
          >
            <Eye className="w-4 h-4 mr-1.5" /> View Site
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            <LogOut className="w-4 h-4 mr-1.5" /> Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Overview</h2>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => session && loadStats(session.access_token)}
              disabled={statsLoading}
              className="text-gray-400 hover:text-white"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1 ${statsLoading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Properties" value={stats?.properties?.total ?? 0} sub={`${stats?.properties?.featured ?? 0} featured`} icon={Building2} color="bg-emerald-600" />
            <StatCard title="Total Leads" value={stats?.leads.total ?? 0} sub={`${stats?.leads.byStatus?.new ?? 0} new`} icon={Users} color="bg-blue-600" />
            <StatCard title="Inquiries" value={stats?.inquiries.total ?? 0} sub={`${stats?.inquiries.byStatus?.pending ?? 0} pending`} icon={FileText} color="bg-purple-600" />
            <StatCard title="Newsletter" value={stats?.newsletter.total ?? 0} sub={`${stats?.newsletter.byStatus?.active ?? 0} active`} icon={Mail} color="bg-teal-600" />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="properties">
          <TabsList className="bg-gray-800 border border-gray-700">
            <TabsTrigger value="properties" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400">
              Properties <Badge className="ml-1.5 bg-gray-700 text-gray-300 text-xs">{stats?.properties?.total ?? 0}</Badge>
            </TabsTrigger>
            <TabsTrigger value="leads" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400">
              Leads <Badge className="ml-1.5 bg-gray-700 text-gray-300 text-xs">{stats?.leads.total ?? 0}</Badge>
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400">
              Inquiries <Badge className="ml-1.5 bg-gray-700 text-gray-300 text-xs">{stats?.inquiries.total ?? 0}</Badge>
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400">
              Newsletter <Badge className="ml-1.5 bg-gray-700 text-gray-300 text-xs">{stats?.newsletter.total ?? 0}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="mt-6">
            <PropertiesTab token={session.access_token} onStatsRefresh={() => loadStats(session.access_token)} />
          </TabsContent>
          <TabsContent value="leads" className="mt-6">
            <LeadsTab token={session.access_token} />
          </TabsContent>
          <TabsContent value="inquiries" className="mt-6">
            <InquiriesTab token={session.access_token} />
          </TabsContent>
          <TabsContent value="newsletter" className="mt-6">
            <NewsletterTab token={session.access_token} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
