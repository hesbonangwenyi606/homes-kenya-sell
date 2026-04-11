import { useState, useEffect, useCallback } from 'react';
import { Property } from '@/components/PropertyCard';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface PropertyInquiry {
  id: string;
  property_id: number;
  property_title: string;
  property_location: string;
  agent_id: number | null;
  agent_name: string | null;
  inquirer_name: string;
  inquirer_email: string;
  inquirer_phone: string | null;
  message: string | null;
  status: 'pending' | 'contacted' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface InquiryFormData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

export function usePropertyInquiries(_userId: string | undefined) {
  const [inquiries, setInquiries] = useState<PropertyInquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch inquiries for a given email (stored locally so user can see their own)
  const fetchInquiries = useCallback(async (email?: string) => {
    if (!email) { setInquiries([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/inquiries`, {
        headers: { 'X-User-Email': email },
      });
      const data = await res.json();
      if (res.ok) setInquiries(data.data ?? []);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Inquiries are fetched on-demand via refetch(email) from the component
  }, []);

  const submitInquiry = async (
    property: Property,
    formData: InquiryFormData,
    agent?: { id: number; name: string }
  ) => {
    try {
      const res = await fetch(`${API}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: property.id,
          property_title: property.title,
          property_location: property.location,
          agent_id: agent?.id ?? undefined,
          agent_name: agent?.name ?? undefined,
          inquirer_name: formData.name,
          inquirer_email: formData.email,
          inquirer_phone: formData.phone || undefined,
          message: formData.message || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to submit inquiry');
      setInquiries((prev) => [data.data, ...prev]);
      return { data: data.data, error: null };
    } catch (err: unknown) {
      return { data: null, error: err as Error };
    }
  };

  const getInquiryCountForProperty = (propertyId: number) =>
    inquiries.filter((i) => i.property_id === propertyId).length;

  const hasInquiredAboutProperty = (propertyId: number) =>
    inquiries.some((i) => i.property_id === propertyId);

  return {
    inquiries,
    loading,
    error,
    submitInquiry,
    getInquiryCountForProperty,
    hasInquiredAboutProperty,
    refetch: fetchInquiries,
  };
}
