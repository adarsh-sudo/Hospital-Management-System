import { authHeaders } from '../utils/auth';

const BASE = '/api/appointments';

export async function getAllAppointments() {
  const res = await fetch(BASE, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch appointments');
  return res.json();
}

export async function getAppointmentById(id) {
  const res = await fetch(`${BASE}/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Appointment not found');
  return res.json();
}

export async function createAppointment(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create appointment');
  }
  return res.json();
}

export async function updateAppointment(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update appointment');
  }
  return res.json();
}

export async function removeAppointment(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to delete appointment');
  }
  return res.json();
}
