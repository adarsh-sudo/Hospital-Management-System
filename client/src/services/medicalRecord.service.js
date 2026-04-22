import { getToken } from '../utils/auth';

const BASE = '/api/medical-records';

function bearerHeader() {
  return { Authorization: `Bearer ${getToken()}` };
}

async function extractError(res, fallback) {
  try {
    const body = await res.json();
    return body.error || fallback;
  } catch {
    return fallback;
  }
}

function toFormData({ appointment_id, diagnosis, notes, prescription }) {
  const fd = new FormData();
  fd.append('appointment_id', appointment_id);
  if (diagnosis)    fd.append('diagnosis', diagnosis);
  if (notes)        fd.append('notes', notes);
  if (prescription) fd.append('prescription', prescription);
  return fd;
}

export async function getAllMedicalRecords() {
  const res = await fetch(BASE, { headers: { ...bearerHeader(), 'Content-Type': 'application/json' } });
  if (!res.ok) throw new Error('Failed to fetch medical records');
  return res.json();
}

export async function createMedicalRecord(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: bearerHeader(),
    body: toFormData(data),
  });
  if (!res.ok) throw new Error(await extractError(res, 'Failed to create medical record'));
  return res.json();
}

export async function updateMedicalRecord(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: bearerHeader(),
    body: toFormData(data),
  });
  if (!res.ok) throw new Error(await extractError(res, 'Failed to update medical record'));
  return res.json();
}

export async function removeMedicalRecord(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE', headers: { ...bearerHeader(), 'Content-Type': 'application/json' } });
  if (!res.ok) throw new Error(await extractError(res, 'Failed to delete medical record'));
  return res.json();
}
