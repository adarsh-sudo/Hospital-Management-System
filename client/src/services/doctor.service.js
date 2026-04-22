import { authHeaders } from '../utils/auth';

export async function getAllDoctors() {
  const res = await fetch('/api/doctors', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch doctors');
  return res.json();
}

export async function getAvailableDoctors() {
  const res = await fetch('/api/doctors/available', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch available doctors');
  return res.json();
}

export async function getMyDoctorProfile() {
  const res = await fetch('/api/doctors/me', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch doctor profile');
  return res.json();
}

export async function updateDoctorProfile(data) {
  const res = await fetch('/api/doctors/me', {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update profile');
  }
  return res.json();
}
