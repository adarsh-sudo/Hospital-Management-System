import { authHeaders } from '../utils/auth';

const BASE = '/api/doctors';

export async function getAllDoctors() {
  const res = await fetch(BASE, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch doctors');
  return res.json();
}

export async function getDoctorById(id) {
  const res = await fetch(`${BASE}/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Doctor not found');
  return res.json();
}

export async function createDoctor(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create doctor');
  }
  return res.json();
}

export async function updateDoctor(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update doctor');
  }
  return res.json();
}

export async function removeDoctor(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to delete doctor');
  }
  return res.json();
}
