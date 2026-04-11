import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Eye,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  Building2,
  Star,
  HelpCircle,
  BookOpen,
  Briefcase,
  CheckCircle,
  X,
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
  description?: string;
  featured?: boolean;
  created_at: string;
  updated_at: string;
}

const PROPERTY_TYPES = ['house', 'apartment', 'bungalow', 'land'] as const;

const BLANK_PROP_FORM = {
  title: '', location: '', price: '', bedrooms: '0', bathrooms: '0',
  landSize: '', type: 'house' as const, image: '', image2: '', image3: '',
  description: '', featured: false,
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

// ── Image upload field ────────────────────────────────────────────────────────

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  token: string;
  required?: boolean;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ label, value, onChange, token, required }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API}/api/admin/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        onChange(`${API}${data.url}`);
      } else {
        setUploadError(data.error ?? 'Upload failed');
      }
    } catch {
      setUploadError('Network error during upload');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}{required && ' *'}</label>
      <div className="flex gap-2 items-start">
        {value ? (
          <img
            src={value}
            alt=""
            className="w-14 h-12 object-cover rounded-lg border border-gray-600 flex-shrink-0 bg-gray-700"
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
          />
        ) : (
          <div className="w-14 h-12 rounded-lg border border-dashed border-gray-600 flex-shrink-0 flex items-center justify-center bg-gray-800">
            <span className="text-gray-600 text-lg">🖼</span>
          </div>
        )}
        <div className="flex-1 space-y-1.5">
          <input
            type="text"
            value={value}
            onChange={(e) => { setUploadError(''); onChange(e.target.value); }}
            placeholder="Paste URL or upload below"
            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <div className="flex items-center gap-2">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <button
              type="button"
              onClick={() => { setUploadError(''); fileRef.current?.click(); }}
              disabled={uploading}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {uploading ? (
                <>
                  <span className="w-3 h-3 border-2 border-gray-400 border-t-emerald-400 rounded-full animate-spin inline-block" />
                  Uploading…
                </>
              ) : (
                '📁 Upload from computer'
              )}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          {uploadError && <p className="text-red-400 text-xs">{uploadError}</p>}
        </div>
      </div>
    </div>
  );
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
      description: p.description ?? '',
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
      description: form.description.trim() || undefined,
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
              <ImageUploadField
                label="Main Image"
                value={form.image}
                onChange={(url) => setForm((f) => ({ ...f, image: url }))}
                token={token}
                required
              />
            </div>
            <div>
              <ImageUploadField
                label="Gallery Image 2"
                value={form.image2}
                onChange={(url) => setForm((f) => ({ ...f, image2: url }))}
                token={token}
              />
            </div>
            <div>
              <ImageUploadField
                label="Gallery Image 3"
                value={form.image3}
                onChange={(url) => setForm((f) => ({ ...f, image3: url }))}
                token={token}
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-xs text-gray-400 mb-1 block">Description</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Describe the property — location highlights, finishes, nearby amenities, access roads…"
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y"
              />
            </div>
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

// ── Pages tab (FAQs, Blog, Careers) ──────────────────────────────────────────

interface FaqItem { id: string; question: string; answer: string; order: number; }
interface BlogPost { id: string; title: string; excerpt: string; content: string; author: string; category: string; image: string; published: boolean; created_at: string; }
interface JobOpening { id: string; title: string; department: string; location: string; type: string; description: string; requirements: string[]; active: boolean; }
interface AboutTeamMember { id: string; name: string; role: string; location: string; order: number; }
interface AboutValue { id: string; icon_name: string; title: string; desc: string; order: number; }
interface AboutStat { id: string; value: string; label: string; order: number; }

const BLANK_FAQ = { question: '', answer: '' };
const BLANK_POST = { title: '', excerpt: '', content: '', author: '', category: 'Market Insights', image: '', published: true };
const BLANK_JOB = { title: '', department: '', location: '', type: 'full-time', description: '', requirements: '', active: true };

const inputCls = 'w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500';
const labelCls = 'text-xs text-gray-400 mb-1 block';

// ─ FAQs Manager ───────────────────────────────────────────────────────────────
const FaqsManager: React.FC<{ token: string }> = ({ token }) => {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [form, setForm] = useState({ ...BLANK_FAQ });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await fetch(`${API}/api/admin/faqs`, { headers: authHeaders(token) }); const d = await r.json(); setItems(d.data ?? []); } finally { setLoading(false); }
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm({ ...BLANK_FAQ }); setShowForm(true); };
  const openEdit = (i: FaqItem) => { setEditing(i); setForm({ question: i.question, answer: i.answer }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) return;
    setSaving(true);
    const url = editing ? `${API}/api/admin/faqs/${editing.id}` : `${API}/api/admin/faqs`;
    await fetch(url, { method: editing ? 'PATCH' : 'POST', headers: authHeaders(token), body: JSON.stringify(form) });
    setSaving(false); setShowForm(false); load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    await fetch(`${API}/api/admin/faqs/${id}`, { method: 'DELETE', headers: authHeaders(token) }); load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button size="sm" onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white"><Plus className="w-4 h-4 mr-1.5" /> Add FAQ</Button>
        <Button size="sm" variant="outline" onClick={load} className="border-gray-600 text-gray-300"><RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh</Button>
      </div>
      {showForm && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-3">
          <h3 className="text-white font-semibold">{editing ? 'Edit FAQ' : 'New FAQ'}</h3>
          <div><label className={labelCls}>Question *</label><input className={inputCls} value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} placeholder="e.g. How do I schedule a viewing?" /></div>
          <div><label className={labelCls}>Answer *</label><textarea className={inputCls} rows={4} value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} placeholder="Detailed answer..." /></div>
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">{saving ? 'Saving…' : editing ? 'Save Changes' : 'Add FAQ'}</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">Cancel</Button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {loading ? <p className="text-gray-500 py-6 text-center">Loading…</p> : items.length === 0 ? <p className="text-gray-500 py-6 text-center">No FAQs yet.</p> : items.map(item => (
          <div key={item.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm">{item.question}</p>
              <p className="text-gray-400 text-xs mt-1 line-clamp-2">{item.answer}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button size="icon" variant="ghost" onClick={() => openEdit(item)} className="h-7 w-7 p-0 text-gray-400 hover:text-white"><Pencil className="w-3.5 h-3.5" /></Button>
              <Button size="icon" variant="ghost" onClick={() => del(item.id)} className="h-7 w-7 p-0 text-gray-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─ Blog Manager ───────────────────────────────────────────────────────────────
const BlogManager: React.FC<{ token: string }> = ({ token }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({ ...BLANK_POST });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await fetch(`${API}/api/admin/blog`, { headers: authHeaders(token) }); const d = await r.json(); setPosts(d.data ?? []); } finally { setLoading(false); }
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm({ ...BLANK_POST }); setShowForm(true); };
  const openEdit = (p: BlogPost) => { setEditing(p); setForm({ title: p.title, excerpt: p.excerpt, content: p.content, author: p.author, category: p.category, image: p.image, published: p.published }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim() || !form.author.trim()) return;
    setSaving(true);
    const url = editing ? `${API}/api/admin/blog/${editing.id}` : `${API}/api/admin/blog`;
    await fetch(url, { method: editing ? 'PATCH' : 'POST', headers: authHeaders(token), body: JSON.stringify(form) });
    setSaving(false); setShowForm(false); load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`${API}/api/admin/blog/${id}`, { method: 'DELETE', headers: authHeaders(token) }); load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button size="sm" onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white"><Plus className="w-4 h-4 mr-1.5" /> Add Post</Button>
        <Button size="sm" variant="outline" onClick={load} className="border-gray-600 text-gray-300"><RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh</Button>
      </div>
      {showForm && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-3">
          <h3 className="text-white font-semibold">{editing ? 'Edit Post' : 'New Post'}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2"><label className={labelCls}>Title *</label><input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Post title" /></div>
            <div><label className={labelCls}>Author *</label><input className={inputCls} value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} placeholder="e.g. James Njenga" /></div>
            <div><label className={labelCls}>Category</label><input className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Market Insights" /></div>
            <div className="sm:col-span-2"><label className={labelCls}>Image URL</label><input className={inputCls} value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." /></div>
            <div className="sm:col-span-2"><label className={labelCls}>Excerpt *</label><textarea className={inputCls} rows={2} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Short summary shown on blog listing..." /></div>
            <div className="sm:col-span-2"><label className={labelCls}>Full Content *</label><textarea className={inputCls} rows={8} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Full article content. Use double newline for paragraphs." /></div>
            <div className="flex items-center gap-2"><input type="checkbox" id="published" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="w-4 h-4 accent-emerald-500" /><label htmlFor="published" className="text-sm text-gray-300">Published</label></div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">{saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Post'}</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">Cancel</Button>
          </div>
        </div>
      )}
      <div className="rounded-xl border border-gray-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-800">
            <TableRow className="border-gray-700 hover:bg-gray-800">
              <TableHead className="text-gray-400">Post</TableHead>
              <TableHead className="text-gray-400 hidden md:table-cell">Author</TableHead>
              <TableHead className="text-gray-400 hidden lg:table-cell">Category</TableHead>
              <TableHead className="text-gray-400">Published</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} className="text-center text-gray-500 py-10">Loading…</TableCell></TableRow>
              : posts.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center text-gray-500 py-10">No posts yet.</TableCell></TableRow>
              : posts.map(p => (
                <TableRow key={p.id} className="border-gray-700 hover:bg-gray-800/50">
                  <TableCell><p className="text-white font-medium text-sm">{p.title}</p><p className="text-gray-400 text-xs line-clamp-1">{p.excerpt}</p></TableCell>
                  <TableCell className="hidden md:table-cell text-gray-300 text-sm">{p.author}</TableCell>
                  <TableCell className="hidden lg:table-cell"><span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">{p.category}</span></TableCell>
                  <TableCell>{p.published ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-gray-600" />}</TableCell>
                  <TableCell className="text-right"><div className="flex items-center justify-end gap-2">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(p)} className="h-7 w-7 p-0 text-gray-400 hover:text-white"><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => del(p.id)} className="h-7 w-7 p-0 text-gray-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div></TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// ─ Careers Manager ────────────────────────────────────────────────────────────
const CareersManager: React.FC<{ token: string }> = ({ token }) => {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<JobOpening | null>(null);
  const [form, setForm] = useState({ ...BLANK_JOB });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await fetch(`${API}/api/admin/careers`, { headers: authHeaders(token) }); const d = await r.json(); setJobs(d.data ?? []); } finally { setLoading(false); }
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm({ ...BLANK_JOB }); setShowForm(true); };
  const openEdit = (j: JobOpening) => {
    setEditing(j);
    setForm({ title: j.title, department: j.department, location: j.location, type: j.type, description: j.description, requirements: j.requirements.join('\n'), active: j.active });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) return;
    setSaving(true);
    const body = { ...form, requirements: form.requirements.split('\n').map(r => r.trim()).filter(Boolean) };
    const url = editing ? `${API}/api/admin/careers/${editing.id}` : `${API}/api/admin/careers`;
    await fetch(url, { method: editing ? 'PATCH' : 'POST', headers: authHeaders(token), body: JSON.stringify(body) });
    setSaving(false); setShowForm(false); load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this job?')) return;
    await fetch(`${API}/api/admin/careers/${id}`, { method: 'DELETE', headers: authHeaders(token) }); load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button size="sm" onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white"><Plus className="w-4 h-4 mr-1.5" /> Add Job</Button>
        <Button size="sm" variant="outline" onClick={load} className="border-gray-600 text-gray-300"><RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh</Button>
      </div>
      {showForm && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-3">
          <h3 className="text-white font-semibold">{editing ? 'Edit Job' : 'New Job Opening'}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2"><label className={labelCls}>Job Title *</label><input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Real Estate Sales Agent" /></div>
            <div><label className={labelCls}>Department</label><input className={inputCls} value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} placeholder="e.g. Sales" /></div>
            <div><label className={labelCls}>Location</label><input className={inputCls} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Nairobi" /></div>
            <div><label className={labelCls}>Type</label>
              <select className={inputCls} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-5"><input type="checkbox" id="active" checked={form.active as boolean} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-emerald-500" /><label htmlFor="active" className="text-sm text-gray-300">Active / Visible</label></div>
            <div className="sm:col-span-2"><label className={labelCls}>Description *</label><textarea className={inputCls} rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Role description..." /></div>
            <div className="sm:col-span-2"><label className={labelCls}>Requirements (one per line)</label><textarea className={inputCls} rows={5} value={form.requirements as string} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} placeholder={"Minimum 2 years experience\nValid driving licence\n..."} /></div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">{saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Job'}</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">Cancel</Button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {loading ? <p className="text-gray-500 py-6 text-center">Loading…</p> : jobs.length === 0 ? <p className="text-gray-500 py-6 text-center">No jobs yet.</p> : jobs.map(job => (
          <div key={job.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-white font-medium text-sm">{job.title}</p>
                {job.active ? <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-400">Active</span> : <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-500">Hidden</span>}
              </div>
              <p className="text-gray-400 text-xs mt-1">{job.department} · {job.location} · {job.type}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button size="icon" variant="ghost" onClick={() => openEdit(job)} className="h-7 w-7 p-0 text-gray-400 hover:text-white"><Pencil className="w-3.5 h-3.5" /></Button>
              <Button size="icon" variant="ghost" onClick={() => del(job.id)} className="h-7 w-7 p-0 text-gray-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─ About: Team Manager ────────────────────────────────────────────────────────
const BLANK_TEAM = { name: '', role: '', location: '' };
const AboutTeamManager: React.FC<{ token: string }> = ({ token }) => {
  const [items, setItems] = useState<AboutTeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AboutTeamMember | null>(null);
  const [form, setForm] = useState({ ...BLANK_TEAM });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await fetch(`${API}/api/admin/about/team`, { headers: authHeaders(token) }); const d = await r.json(); setItems(d.data ?? []); } finally { setLoading(false); }
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm({ ...BLANK_TEAM }); setShowForm(true); };
  const openEdit = (m: AboutTeamMember) => { setEditing(m); setForm({ name: m.name, role: m.role, location: m.location }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.role.trim()) return;
    setSaving(true);
    const url = editing ? `${API}/api/admin/about/team/${editing.id}` : `${API}/api/admin/about/team`;
    await fetch(url, { method: editing ? 'PATCH' : 'POST', headers: authHeaders(token), body: JSON.stringify(form) });
    setSaving(false); setShowForm(false); load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this team member?')) return;
    await fetch(`${API}/api/admin/about/team/${id}`, { method: 'DELETE', headers: authHeaders(token) }); load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button size="sm" onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white"><Plus className="w-4 h-4 mr-1.5" /> Add Member</Button>
        <Button size="sm" variant="outline" onClick={load} className="border-gray-600 text-gray-300"><RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh</Button>
      </div>
      {showForm && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-3">
          <h3 className="text-white font-semibold">{editing ? 'Edit Member' : 'Add Team Member'}</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            <div><label className={labelCls}>Full Name *</label><input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. James Njenga" /></div>
            <div><label className={labelCls}>Role / Title *</label><input className={inputCls} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Founder & CEO" /></div>
            <div><label className={labelCls}>Location</label><input className={inputCls} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Nairobi" /></div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">{saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Member'}</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">Cancel</Button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {loading ? <p className="text-gray-500 py-6 text-center">Loading…</p> : items.length === 0 ? <p className="text-gray-500 py-6 text-center">No team members yet.</p> : items.map(m => (
          <div key={m.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">{m.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm">{m.name}</p>
              <p className="text-gray-400 text-xs mt-0.5">{m.role} · {m.location}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button size="icon" variant="ghost" onClick={() => openEdit(m)} className="h-7 w-7 p-0 text-gray-400 hover:text-white"><Pencil className="w-3.5 h-3.5" /></Button>
              <Button size="icon" variant="ghost" onClick={() => del(m.id)} className="h-7 w-7 p-0 text-gray-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─ About: Values Manager ──────────────────────────────────────────────────────
const AVAILABLE_ICONS = ['Shield', 'Users', 'TrendingUp', 'Award', 'Star', 'Home', 'MapPin', 'CheckCircle'];
const BLANK_VALUE = { icon_name: 'Shield', title: '', desc: '' };
const AboutValuesManager: React.FC<{ token: string }> = ({ token }) => {
  const [items, setItems] = useState<AboutValue[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AboutValue | null>(null);
  const [form, setForm] = useState({ ...BLANK_VALUE });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await fetch(`${API}/api/admin/about/values`, { headers: authHeaders(token) }); const d = await r.json(); setItems(d.data ?? []); } finally { setLoading(false); }
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm({ ...BLANK_VALUE }); setShowForm(true); };
  const openEdit = (v: AboutValue) => { setEditing(v); setForm({ icon_name: v.icon_name, title: v.title, desc: v.desc }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.title.trim() || !form.desc.trim()) return;
    setSaving(true);
    const url = editing ? `${API}/api/admin/about/values/${editing.id}` : `${API}/api/admin/about/values`;
    await fetch(url, { method: editing ? 'PATCH' : 'POST', headers: authHeaders(token), body: JSON.stringify(form) });
    setSaving(false); setShowForm(false); load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this value?')) return;
    await fetch(`${API}/api/admin/about/values/${id}`, { method: 'DELETE', headers: authHeaders(token) }); load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button size="sm" onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white"><Plus className="w-4 h-4 mr-1.5" /> Add Value</Button>
        <Button size="sm" variant="outline" onClick={load} className="border-gray-600 text-gray-300"><RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh</Button>
      </div>
      {showForm && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-3">
          <h3 className="text-white font-semibold">{editing ? 'Edit Value' : 'Add Core Value'}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Icon</label>
              <select className={inputCls} value={form.icon_name} onChange={e => setForm(f => ({ ...f, icon_name: e.target.value }))}>
                {AVAILABLE_ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Title *</label><input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Integrity" /></div>
            <div className="sm:col-span-2"><label className={labelCls}>Description *</label><textarea className={inputCls} rows={3} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Short description of this value..." /></div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">{saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Value'}</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">Cancel</Button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {loading ? <p className="text-gray-500 py-6 text-center">Loading…</p> : items.length === 0 ? <p className="text-gray-500 py-6 text-center">No values yet.</p> : items.map(v => (
          <div key={v.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex items-start justify-between gap-4">
            <div className="w-8 h-8 bg-emerald-900/40 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-emerald-400 text-xs font-mono">{v.icon_name.slice(0, 2)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm">{v.title} <span className="text-gray-500 text-xs font-normal">({v.icon_name})</span></p>
              <p className="text-gray-400 text-xs mt-1 line-clamp-2">{v.desc}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button size="icon" variant="ghost" onClick={() => openEdit(v)} className="h-7 w-7 p-0 text-gray-400 hover:text-white"><Pencil className="w-3.5 h-3.5" /></Button>
              <Button size="icon" variant="ghost" onClick={() => del(v.id)} className="h-7 w-7 p-0 text-gray-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─ About: Story & Stats Manager ───────────────────────────────────────────────
const AboutStoryManager: React.FC<{ token: string }> = ({ token }) => {
  const [story, setStory] = useState<string[]>(['', '', '']);
  const [stats, setStats] = useState<AboutStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/admin/about/story`, { headers: authHeaders(token) });
      const d = await r.json();
      if (d.data) { setStory(d.data.story ?? []); setStats(d.data.stats ?? []); }
    } finally { setLoading(false); }
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`${API}/api/admin/about/story`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({ story, stats }),
    });
    setSaving(false);
  };

  const updatePara = (i: number, val: string) => setStory(s => s.map((p, idx) => idx === i ? val : p));
  const addPara = () => setStory(s => [...s, '']);
  const removePara = (i: number) => setStory(s => s.filter((_, idx) => idx !== i));
  const updateStat = (i: number, field: 'value' | 'label', val: string) =>
    setStats(s => s.map((st, idx) => idx === i ? { ...st, [field]: val } : st));

  if (loading) return <p className="text-gray-500 py-6 text-center">Loading…</p>;

  return (
    <div className="space-y-6">
      {/* Story Paragraphs */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Story Paragraphs</h3>
          <button onClick={addPara} className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add paragraph</button>
        </div>
        {story.map((para, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1">
              <label className={labelCls}>Paragraph {i + 1}</label>
              <textarea className={inputCls} rows={3} value={para} onChange={e => updatePara(i, e.target.value)} placeholder="Paragraph text..." />
            </div>
            {story.length > 1 && (
              <button onClick={() => removePara(i)} className="mt-5 text-gray-600 hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
            )}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
        <h3 className="text-white font-semibold">Stats / Key Numbers</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <div key={stat.id} className="flex gap-2">
              <div className="w-24">
                <label className={labelCls}>Value</label>
                <input className={inputCls} value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)} placeholder="500+" />
              </div>
              <div className="flex-1">
                <label className={labelCls}>Label</label>
                <input className={inputCls} value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} placeholder="Properties Listed" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
        {saving ? 'Saving…' : 'Save Story & Stats'}
      </Button>
    </div>
  );
};

// ─ About Manager (combines sub-tabs) ─────────────────────────────────────────
const AboutManager: React.FC<{ token: string }> = ({ token }) => {
  const [sub, setSub] = useState<'team' | 'values' | 'story'>('team');
  const subs = [
    { id: 'team' as const, label: 'Team Members' },
    { id: 'values' as const, label: 'Core Values' },
    { id: 'story' as const, label: 'Story & Stats' },
  ];
  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {subs.map(({ id, label }) => (
          <button key={id} onClick={() => setSub(id)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border ${sub === id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-800 text-gray-400 hover:text-white border-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>
      {sub === 'team' && <AboutTeamManager token={token} />}
      {sub === 'values' && <AboutValuesManager token={token} />}
      {sub === 'story' && <AboutStoryManager token={token} />}
    </div>
  );
};

// ─ PagesTab ───────────────────────────────────────────────────────────────────
const PagesTab: React.FC<{ token: string }> = ({ token }) => {
  const [section, setSection] = useState<'faqs' | 'blog' | 'careers' | 'about'>('faqs');
  const sections = [
    { id: 'faqs' as const, label: 'FAQs', icon: HelpCircle },
    { id: 'blog' as const, label: 'Blog Posts', icon: BookOpen },
    { id: 'careers' as const, label: 'Careers', icon: Briefcase },
    { id: 'about' as const, label: 'About Page', icon: Users },
  ];
  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              section === id ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>
      {section === 'faqs' && <FaqsManager token={token} />}
      {section === 'blog' && <BlogManager token={token} />}
      {section === 'careers' && <CareersManager token={token} />}
      {section === 'about' && <AboutManager token={token} />}
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
          <TabsList className="bg-gray-800 border border-gray-700 flex-wrap h-auto gap-1">
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
            <TabsTrigger value="pages" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400">
              Pages
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
          <TabsContent value="pages" className="mt-6">
            <PagesTab token={session.access_token} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
