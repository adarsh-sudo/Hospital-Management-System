import { useState, useEffect, useCallback } from 'react';
import { getAllAppointments, createAppointment, updateAppointment, removeAppointment } from '../services/appointment.service';

export default function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllAppointments();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const add = async (data) => {
    const created = await createAppointment(data);
    setAppointments((prev) => [...prev, created]);
  };

  const edit = async (id, data) => {
    const updated = await updateAppointment(id, data);
    setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const remove = async (id) => {
    await removeAppointment(id);
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  return { appointments, loading, error, refetch: fetch, add, edit, remove };
}
