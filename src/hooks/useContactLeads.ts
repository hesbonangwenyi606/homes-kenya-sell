import { useState } from 'react';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface ContactLeadInput {
  fullName: string;
  email: string;
  phone: string;
  purpose: 'buy' | 'rent' | 'invest';
  preferredLocations?: string;
  propertyType?: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  bedrooms?: number | null;
  timeline?: string;
  preferredContactMethod?: 'phone' | 'email' | 'whatsapp';
  message?: string;
}

export function useContactLeads(_userId?: string) {
  const [loading, setLoading] = useState(false);

  const submitLead = async (input: ContactLeadInput) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: input.fullName,
          email: input.email,
          phone: input.phone,
          purpose: input.purpose,
          preferred_locations: input.preferredLocations || undefined,
          property_type: input.propertyType || undefined,
          budget_min: input.budgetMin ?? undefined,
          budget_max: input.budgetMax ?? undefined,
          bedrooms: input.bedrooms ?? undefined,
          timeline: input.timeline || undefined,
          preferred_contact_method: input.preferredContactMethod || undefined,
          message: input.message || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to submit');
      return { data: data.data, error: null };
    } catch (err: unknown) {
      return { data: null, error: err as Error };
    } finally {
      setLoading(false);
    }
  };

  return { loading, submitLead };
}
