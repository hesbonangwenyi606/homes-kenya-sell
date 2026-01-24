import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Property } from '@/components/PropertyCard';
import { Agent } from '@/components/AgentCard';

export interface PropertyInquiry {
  id: string;
  user_id: string | null;
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

export function usePropertyInquiries(userId: string | undefined) {
  const [inquiries, setInquiries] = useState<PropertyInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    if (!userId) {
      setInquiries([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('property_inquiries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const submitInquiry = async (
    property: Property,
    formData: InquiryFormData,
    agent?: Agent
  ) => {
    try {
      const { data, error } = await supabase
        .from('property_inquiries')
        .insert({
          user_id: userId || null,
          property_id: property.id,
          property_title: property.title,
          property_location: property.location,
          agent_id: agent?.id || null,
          agent_name: agent?.name || null,
          inquirer_name: formData.name,
          inquirer_email: formData.email,
          inquirer_phone: formData.phone || null,
          message: formData.message || null,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      
      if (userId) {
        setInquiries(prev => [data, ...prev]);
      }
      
      return { data, error: null };
    } catch (err: any) {
      console.error('Error submitting inquiry:', err);
      return { data: null, error: err };
    }
  };

  const getInquiryCountForProperty = (propertyId: number) => {
    return inquiries.filter(i => i.property_id === propertyId).length;
  };

  const hasInquiredAboutProperty = (propertyId: number) => {
    return inquiries.some(i => i.property_id === propertyId);
  };

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
