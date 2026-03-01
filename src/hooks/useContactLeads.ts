import { useState } from 'react';
import { supabase } from '@/lib/supabase';

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

export function useContactLeads(userId?: string) {
  const [loading, setLoading] = useState(false);

  const submitLead = async (input: ContactLeadInput) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_leads')
        .insert({
          user_id: userId || null,
          full_name: input.fullName,
          email: input.email,
          phone: input.phone,
          purpose: input.purpose,
          preferred_locations: input.preferredLocations || null,
          property_type: input.propertyType || null,
          budget_min: input.budgetMin ?? null,
          budget_max: input.budgetMax ?? null,
          bedrooms: input.bedrooms ?? null,
          timeline: input.timeline || null,
          preferred_contact_method: input.preferredContactMethod || null,
          message: input.message || null,
          source: 'website_contact_form',
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submitLead,
  };
}
