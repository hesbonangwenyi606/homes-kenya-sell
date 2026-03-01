import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useNewsletterSubscribers() {
  const [loading, setLoading] = useState(false);

  const subscribe = async (email: string) => {
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: normalizedEmail });

      if (error) throw error;
      return { data: null, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    subscribe,
  };
}
