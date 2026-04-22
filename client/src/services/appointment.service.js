import { authHeaders } from '../utils/auth';

export async function bookAppointment(data) {
  const res = await fetch('/api/appointments', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to book appointment');
  }
  return res.json();
}

export async function getMyAppointments() {
  const res = await fetch('/api/appointments/mine', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch appointments');
  return res.json();
}

export async function getAppointmentRequests() {
  const res = await fetch('/api/appointments/requests', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch requests');
  return res.json();
}

export async function updateAppointmentStatus(id, status) {
  const res = await fetch(`/api/appointments/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update status');
  }
  return res.json();
}
