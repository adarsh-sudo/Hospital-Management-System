import { useState, useEffect, useCallback } from 'react';
import { getAllMedicalRecords, createMedicalRecord, updateMedicalRecord, removeMedicalRecord } from '../services/medicalRecord.service';

export default function useMedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllMedicalRecords();
      setRecords(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const add = async (data) => {
    const created = await createMedicalRecord(data);
    setRecords((prev) => [...prev, created]);
  };

  const edit = async (id, data) => {
    const updated = await updateMedicalRecord(id, data);
    setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const remove = async (id) => {
    await removeMedicalRecord(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  return { records, loading, error, refetch: fetch, add, edit, remove };
}
