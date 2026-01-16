import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Property } from '@/components/PropertyCard';

export interface SavedProperty {
  id: string;
  user_id: string;
  property_id: number;
  property_title: string;
  property_location: string;
  property_price: number;
  property_type: string;
  property_image: string;
  property_bedrooms: number;
  property_bathrooms: number;
  property_sqft: number;
  created_at: string;
}

export function useSavedProperties(userId: string | undefined) {
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedProperties = useCallback(async () => {
    if (!userId) {
      setSavedProperties([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('saved_properties')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedProperties(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching saved properties:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSavedProperties();
  }, [fetchSavedProperties]);

  const saveProperty = async (property: Property) => {
    if (!userId) {
      return { error: { message: 'Please sign in to save properties' } };
    }

    try {
      const { data, error } = await supabase
        .from('saved_properties')
        .insert({
          user_id: userId,
          property_id: property.id,
          property_title: property.title,
          property_location: property.location,
          property_price: property.price,
          property_type: property.type,
          property_image: property.image,
          property_bedrooms: property.bedrooms,
          property_bathrooms: property.bathrooms,
          property_sqft: property.sqft,
        })
        .select()
        .single();

      if (error) throw error;
      
      setSavedProperties(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err: any) {
      console.error('Error saving property:', err);
      return { data: null, error: err };
    }
  };

  const unsaveProperty = async (propertyId: number) => {
    if (!userId) {
      return { error: { message: 'Please sign in to manage saved properties' } };
    }

    try {
      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', userId)
        .eq('property_id', propertyId);

      if (error) throw error;
      
      setSavedProperties(prev => prev.filter(p => p.property_id !== propertyId));
      return { error: null };
    } catch (err: any) {
      console.error('Error removing saved property:', err);
      return { error: err };
    }
  };

  const isPropertySaved = (propertyId: number) => {
    return savedProperties.some(p => p.property_id === propertyId);
  };

  const toggleSaveProperty = async (property: Property) => {
    if (isPropertySaved(property.id)) {
      return unsaveProperty(property.id);
    } else {
      return saveProperty(property);
    }
  };

  return {
    savedProperties,
    loading,
    error,
    saveProperty,
    unsaveProperty,
    isPropertySaved,
    toggleSaveProperty,
    refetch: fetchSavedProperties,
  };
}
