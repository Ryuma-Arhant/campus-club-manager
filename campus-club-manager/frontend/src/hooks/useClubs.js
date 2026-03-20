import { useState, useEffect } from 'react';
import { getClubs } from '../api/clubApi.js';

export default function useClubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const res = await getClubs();
      setClubs(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load clubs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClubs(); }, []);

  return { clubs, loading, error, refetch: fetchClubs };
}
