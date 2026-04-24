# Skill: Database Queries

## Purpose
Define how raw SQL queries are written and organized in MediCore using the `pg` driver.

---

## Pool Setup (`src/config/db.js`)

```js
const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

module.exports = pool;
```

---

## File Structure

One file per domain. Each imports the pool and exports named async functions.

```
src/db/
  users.js          → findUserByEmail, findUserById, createUser
  patients.js       → createPatient, getPatientByUserId, updatePatientProfile
  doctors.js        → createDoctor, getAllDoctors, getAvailableDoctors,
                       getDoctorById, getDoctorByUserId, updateAvailability
  appointments.js   → createAppointment, getAppointmentsByPatient,
                       getAppointmentsByDoctor, updateAppointmentStatus
```

---

## Query Patterns

### Find by user_id (JOIN to users for name/email)
```js
async function getDoctorByUserId(user_id) {
  const { rows } = await pool.query(
    `SELECT d.*, u.name, u.email
     FROM doctors d
     JOIN users u ON u.id = d.user_id
     WHERE d.user_id = $1`,
    [user_id]
  );
  return rows[0] ?? null;
}
```

### List all (with user JOIN)
```js
async function getAllDoctors() {
  const { rows } = await pool.query(
    `SELECT d.*, u.name, u.email
     FROM doctors d
     JOIN users u ON u.id = d.user_id
     ORDER BY u.name`
  );
  return rows;
}
```

### Filtered list
```js
async function getAvailableDoctors() {
  const { rows } = await pool.query(
    `SELECT d.*, u.name, u.email
     FROM doctors d
     JOIN users u ON u.id = d.user_id
     WHERE d.is_available = TRUE
     ORDER BY u.name`
  );
  return rows;
}
```

### Create (return inserted row)
```js
async function createAppointment({ patient_id, doctor_id, slot_label, slot_time }) {
  const { rows } = await pool.query(
    `INSERT INTO appointments (patient_id, doctor_id, slot_label, slot_time)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [patient_id, doctor_id, slot_label, slot_time]
  );
  return rows[0];
}
```

### Update (PATCH — only named fields)
```js
async function updateAvailability(user_id, { is_available, available_slots, specialization, phone }) {
  const { rows } = await pool.query(
    `UPDATE doctors
     SET is_available    = $1,
         available_slots = $2,
         specialization  = $3,
         phone           = $4
     WHERE user_id = $5
     RETURNING *`,
    [is_available, JSON.stringify(available_slots), specialization, phone, user_id]
  );
  return rows[0];
}
```

### Status update (doctor approves/rejects appointment)
```js
async function updateAppointmentStatus(id, status) {
  const { rows } = await pool.query(
    `UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return rows[0];
}
```

### Appointments with JOINs
```js
// Patient view — needs doctor name
async function getAppointmentsByPatient(patient_id) {
  const { rows } = await pool.query(
    `SELECT a.*, u.name AS doctor_name, d.specialization
     FROM appointments a
     JOIN doctors  d ON d.id = a.doctor_id
     JOIN users    u ON u.id = d.user_id
     WHERE a.patient_id = $1
     ORDER BY a.slot_time DESC`,
    [patient_id]
  );
  return rows;
}

// Doctor view — needs patient name
async function getAppointmentsByDoctor(doctor_id) {
  const { rows } = await pool.query(
    `SELECT a.*, u.name AS patient_name
     FROM appointments a
     JOIN patients p ON p.id = a.patient_id
     JOIN users    u ON u.id = p.user_id
     WHERE a.doctor_id = $1
     ORDER BY a.slot_time DESC`,
    [doctor_id]
  );
  return rows;
}
```

---

## JSONB — available_slots

`available_slots` is stored as `JSONB` on the `doctors` table.

```js
// Writing — always stringify
JSON.stringify([{ date: '2026-04-28', start: '09:00', end: '10:00' }])

// Reading — pg returns it already parsed as a JS array, no JSON.parse needed
const slots = doctor.available_slots; // already an array
```

---

## Parameterization Rules

- **Always** use `$1, $2, ...` — never string interpolation
- Use `RETURNING *` after INSERT/UPDATE to avoid a second SELECT
- `findBy*` returns `rows[0] ?? null` — never undefined, never throws on missing

---

## Rules

- No SQL in controllers — only in `src/db/`
- All query functions are `async` and return plain JS values
- Every `src/db/` file imports the pool directly — never `req`/`res`
- Export as named exports only (no default object)
