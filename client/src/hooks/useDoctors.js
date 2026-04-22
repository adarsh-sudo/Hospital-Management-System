import { useState, useEffect, useCallback } from 'react';
import { getAllDoctors, createDoctor, updateDoctor, removeDoctor } from '../services/doctor.service';

export default function useDoctors() {
  const [doctors, setDoctors]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDoctors();
      setDoctors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const add = async (data) => {
    const created = await createDoctor(data);
    setDoctors((prev) => [...prev, created]);
  };

  const edit = async (id, data) => {
    const updated = await updateDoctor(id, data);
    setDoctors((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  const remove = async (id) => {
    await removeDoctor(id);
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  return { doctors, loading, error, refetch: fetch, add, edit, remove };
}
