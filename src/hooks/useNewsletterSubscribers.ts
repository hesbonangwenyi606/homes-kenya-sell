import { useState } from 'react';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export function useNewsletterSubscribers() {
  const [loading, setLoading] = useState(false);

  const subscribe = async (email: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to subscribe');
      return { data: data.data, error: null };
    } catch (err: unknown) {
      return { data: null, error: err as Error };
    } finally {
      setLoading(false);
    }
  };

  return { loading, subscribe };
}
