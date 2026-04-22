import { useState, useEffect, useCallback } from 'react';
import { getAllPatients, createPatient, updatePatient, removePatient } from '../services/patient.service';

export default function usePatients() {
  const [patients, setPatients]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllPatients();
      setPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const add = async (data) => {
    const created = await createPatient(data);
    setPatients((prev) => [...prev, created]);
  };

  const edit = async (id, data) => {
    const updated = await updatePatient(id, data);
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const remove = async (id) => {
    await removePatient(id);
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  return { patients, loading, error, refetch: fetch, add, edit, remove };
}
