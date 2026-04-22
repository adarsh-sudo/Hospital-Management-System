import { authHeaders } from '../utils/auth';

const BASE = '/api/patients';

export async function getAllPatients() {
  const res = await fetch(BASE, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch patients');
  return res.json();
}

export async function getPatientById(id) {
  const res = await fetch(`${BASE}/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Patient not found');
  return res.json();
}

export async function createPatient(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create patient');
  }
  return res.json();
}

export async function updatePatient(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update patient');
  }
  return res.json();
}

export async function removePatient(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to delete patient');
  }
  return res.json();
}
