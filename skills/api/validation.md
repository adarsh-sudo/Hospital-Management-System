# Skill: API Validation

## Purpose
Define what to validate, where, and how for every incoming request in MediCore.

---

## Where Validation Happens

Validation is done inline at the top of each controller function — no separate middleware validator.

```
Request → requireAuth → requireRole → Controller (validate here) → DB layer
```

- **Structural validation** (required fields, types) → top of controller
- **Business validation** (doctor exists, slot belongs to this doctor) → controller before DB write
- **Never** validate inside `src/db/` functions

---

## Pattern

```js
async function bookAppointment(req, res) {
  const { doctor_id, slot_label, slot_time } = req.body;

  if (!doctor_id || !slot_label || !slot_time)
    return res.status(400).json({ error: 'Missing required fields' });

  // proceed to DB
}
```

Return on the first missing field — do not accumulate errors.

---

## Field Rules by Endpoint

### POST /api/auth/register
| Field      | Rule                                      |
|------------|-------------------------------------------|
| `name`     | Required, non-empty string                |
| `email`    | Required, non-empty string                |
| `password` | Required, non-empty string                |
| `role`     | Required, must be `'patient'` or `'doctor'` |

### PATCH /api/doctors/me
| Field             | Rule                                    |
|-------------------|-----------------------------------------|
| `is_available`    | Boolean                                 |
| `specialization`  | Optional string                         |
| `phone`           | Optional string                         |
| `available_slots` | Array of `{ date, start, end }` objects |

Each slot must have `date` (YYYY-MM-DD), `start` and `end` (HH:MM), and `end > start`.

### POST /api/appointments
| Field        | Rule                    |
|--------------|-------------------------|
| `doctor_id`  | Required, positive integer |
| `slot_label` | Required, non-empty string |
| `slot_time`  | Required, ISO datetime string |

### PATCH /api/appointments/:id/status
| Field    | Rule                                      |
|----------|-------------------------------------------|
| `status` | Required, must be `'approved'` or `'rejected'` |

---

## ID Parameter Validation

Always parse and check `:id` params before using them in a query:

```js
const id = parseInt(req.params.id, 10);
if (!id || id < 1) return res.status(400).json({ error: 'Invalid ID' });
```

---

## Identity from JWT — Not from Body

For `/me` routes, the caller's identity comes from `req.user`, not from the request body.

```js
// Good — use profile_id from the verified token
const patient_id = req.user.profile_id;

// Bad — trusting body for identity
const patient_id = req.body.patient_id;
```

---

## What NOT to Do

```js
// Bad — SQL injection risk
pool.query(`SELECT * FROM doctors WHERE id = ${req.body.doctor_id}`);

// Bad — wrong status code for missing fields
return res.status(500).json({ error: 'doctor_id missing' });

// Bad — validating inside the DB layer
async function createAppointment(data) {
  if (!data.doctor_id) throw new Error('Missing doctor_id'); // too late
}
```

---

## Rules

- Return `400` for missing/invalid fields, not `422` or `500`
- Never trust `req.body` for the caller's identity — always use `req.user`
- Always coerce `:id` params with `parseInt` before use in SQL
- Never interpolate request data directly into SQL strings
