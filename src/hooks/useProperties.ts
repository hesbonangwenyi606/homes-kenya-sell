import { useState, useEffect } from 'react';
import { Property } from '@/components/PropertyCard';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/api/properties`)
      .then((r) => r.json())
      .then((data) => {
        setProperties(data.data ?? []);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { properties, loading, error };
}
