# Skill: REST API Design

## Purpose
Document all API endpoints, conventions, and response shapes for MediCore.

---

## Endpoint Reference

### Auth (public)
```
POST /api/auth/register   → { token, user }
POST /api/auth/login      → { token, user }
```

### Doctors
```
GET    /api/doctors            [patient]  → array of all doctors with slots
GET    /api/doctors/available  [patient]  → array of available doctors only
GET    /api/doctors/me         [doctor]   → own profile + slots
PATCH  /api/doctors/me         [doctor]   → update profile, availability, slots
```

### Appointments
```
POST   /api/appointments              [patient] → create booking
GET    /api/appointments/mine         [patient] → patient's own bookings
GET    /api/appointments/requests     [doctor]  → appointments for this doctor
PATCH  /api/appointments/:id/status   [doctor]  → approve or reject
```

### Patients
```
GET    /api/patients/me   [patient]  → own profile
PATCH  /api/patients/me   [patient]  → update profile
```

Role labels `[patient]` / `[doctor]` mean the route requires `requireAuth` + `requireRole('patient'|'doctor')`.

---

## Response Shape

No envelope wrapper — return the data directly:

```json
// Success (single object)
{ "id": 1, "name": "Rahul Gupta", "role": "patient", ... }

// Success (list)
[ { "id": 1, ... }, { "id": 2, ... } ]

// Auth response
{ "token": "<jwt>", "user": { "id": 1, "name": "...", "role": "patient", "profile_id": 3 } }

// Error
{ "error": "Email already registered" }
```

---

## HTTP Status Codes

| Code | When to use                                        |
|------|----------------------------------------------------|
| 200  | Successful GET / PATCH                             |
| 201  | Resource created (POST)                            |
| 400  | Missing or invalid fields                          |
| 401  | No token or invalid token                          |
| 403  | Authenticated but wrong role                       |
| 404  | Resource not found                                 |
| 409  | Conflict (duplicate email)                         |
| 500  | Unhandled server error                             |

---

## URL Conventions

- Plural nouns: `/doctors`, `/appointments`, `/patients`
- `/me` for the authenticated user's own resource (no `:id` needed — identity from JWT)
- Action sub-resources use nouns, not verbs: `/status` not `/approve`

---

## Request Bodies

### POST /api/auth/register
```json
{ "name": "Rahul Gupta", "email": "rahul@mail.com", "password": "...", "role": "patient" }
```

### PATCH /api/doctors/me
```json
{
  "specialization": "Cardiology",
  "phone": "+91 98201 11001",
  "is_available": true,
  "available_slots": [
    { "date": "2026-04-28", "start": "09:00", "end": "10:00" }
  ]
}
```

### POST /api/appointments
```json
{
  "doctor_id": 2,
  "slot_label": "Tue, Apr 28, 2026 · 09:00–10:00",
  "slot_time":  "2026-04-28T09:00:00"
}
```

### PATCH /api/appointments/:id/status
```json
{ "status": "approved" }   // or "rejected"
```

---

## Rules

- All routes except `/api/auth` require `requireAuth` middleware
- Role-specific routes require `requireRole('patient'|'doctor')` after `requireAuth`
- Never interpolate query params directly into SQL — always use `$n` placeholders
- Return 404 (not 500) when a record is not found
- All new routes go in `src/routes/` — never inline in `server.js`
