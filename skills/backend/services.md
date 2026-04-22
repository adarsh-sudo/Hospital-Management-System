# Skill: Backend Services

## Purpose
Define how shared, reusable logic is structured and used across the backend.

---

## What Belongs in a Service

Services sit between controllers and the DB layer when logic is too complex
for a controller but not SQL-specific. Use them for:

- Multi-step operations (e.g., create appointment + insert medical record)
- Cross-domain coordination (e.g., check doctor availability before booking)
- Reusable business rules used by multiple controllers

If the logic is a single DB call → keep it in the controller.
If the logic spans multiple DB calls or domains → extract into a service.

---

## File Location & Naming

```
src/
  services/
    appointments.service.js
    patients.service.js
```

---

## Service Structure

```js
// src/services/appointments.service.js
const appointmentQueries = require('../db/appointments');
const doctorQueries      = require('../db/doctors');

async function bookAppointment({ patient_id, doctor_id, scheduled_at }) {
  // 1. Validate doctor exists and is active
  const doctor = await doctorQueries.findById(doctor_id);
  if (!doctor || !doctor.is_active) {
    const err = new Error('Doctor not available');
    err.status = 400;
    throw err;
  }

  // 2. Check for scheduling conflict
  const conflict = await appointmentQueries.findConflict({ doctor_id, scheduled_at });
  if (conflict) {
    const err = new Error('Time slot already booked');
    err.status = 409;
    throw err;
  }

  // 3. Create the appointment
  return appointmentQueries.create({ patient_id, doctor_id, scheduled_at });
}

module.exports = { bookAppointment };
```

---

## Controller → Service Wiring

```js
// src/controllers/appointments.js
const appointmentService = require('../services/appointments.service');

async function create(req, res, next) {
  try {
    const appointment = await appointmentService.bookAppointment(req.body);
    res.status(201).json({ data: appointment });
  } catch (err) {
    next(err);
  }
}
```

---

## Error Handling in Services

- Throw plain `Error` objects with a `.status` property for HTTP-mappable errors
- Never import `req` / `res` — services are framework-agnostic
- Let the global error handler in `server.js` format the response

```js
// Good
const err = new Error('Patient not found');
err.status = 404;
throw err;

// Bad
res.status(404).json({ error: 'Patient not found' }); // services don't touch res
```

---

## Transactions

Use a transaction when multiple DB writes must succeed or fail together.

```js
const pool = require('../config/db');

async function transferRecord({ from_patient_id, to_patient_id, record_id }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `UPDATE medical_records SET patient_id = $1 WHERE id = $2`,
      [to_patient_id, record_id]
    );
    await client.query(
      `INSERT INTO audit_log (action, record_id) VALUES ('transfer', $1)`,
      [record_id]
    );
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
```

---

## Rules
- Services must be stateless — no module-level mutable state
- One service file per domain
- Services may call other services only if there's no circular dependency
- Never write SQL directly in a service — delegate to the DB layer
