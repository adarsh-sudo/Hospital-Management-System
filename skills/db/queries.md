# Skill: Database Queries

## Purpose
Define how raw SQL queries are written, organized, and executed using `pg`.

---

## Pool Setup

```js
// src/config/db.js
const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max:      10,
  idleTimeoutMillis: 30000,
});

module.exports = pool;
```

---

## Query File Structure

One file per domain. Each file imports the pool and exports named async functions.

```
src/db/
  patients.js
  doctors.js
  appointments.js
  medical_records.js
```

---

## Query Patterns

### Find all (with pagination)
```js
async function findAll({ limit = 20, offset = 0 }) {
  const { rows } = await pool.query(
    `SELECT id, first_name, last_name, phone, created_at
     FROM patients
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows;
}
```

### Find by ID (returns null if not found)
```js
async function findById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM patients WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}
```

### Create (return inserted row)
```js
async function create({ first_name, last_name, date_of_birth, phone }) {
  const { rows } = await pool.query(
    `INSERT INTO patients (first_name, last_name, date_of_birth, phone)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [first_name, last_name, date_of_birth, phone]
  );
  return rows[0];
}
```

### Update (partial — PATCH)
```js
async function update(id, { first_name, phone }) {
  const { rows } = await pool.query(
    `UPDATE patients
     SET first_name = COALESCE($1, first_name),
         phone      = COALESCE($2, phone),
         updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [first_name ?? null, phone ?? null, id]
  );
  return rows[0] ?? null;
}
```

### Delete
```js
async function remove(id) {
  const { rowCount } = await pool.query(
    `DELETE FROM patients WHERE id = $1`,
    [id]
  );
  return rowCount > 0;
}
```

### Count (for pagination meta)
```js
async function count() {
  const { rows } = await pool.query(`SELECT COUNT(*)::int AS total FROM patients`);
  return rows[0].total;
}
```

---

## Parameterization Rules

- **Always** use `$1, $2, ...` placeholders — never string interpolation
- Cast counts/aggregates explicitly: `COUNT(*)::int`
- Use `RETURNING *` after INSERT/UPDATE to avoid a second SELECT

```js
// Good
pool.query('SELECT * FROM patients WHERE id = $1', [id]);

// Bad — SQL injection risk
pool.query(`SELECT * FROM patients WHERE id = ${id}`);
```

---

## NULL Handling

```js
// Use COALESCE for optional PATCH fields
SET phone = COALESCE($1, phone)   -- only updates if $1 is not null

// Use IS NULL / IS NOT NULL in filters, not = NULL
WHERE discharged_at IS NULL
```

---

## Joins (common patterns)

```sql
-- Appointment with patient + doctor info
SELECT
  a.id,
  a.scheduled_at,
  a.status,
  p.first_name  AS patient_first,
  p.last_name   AS patient_last,
  d.first_name  AS doctor_first,
  d.last_name   AS doctor_last,
  d.specialization
FROM appointments a
JOIN patients p ON p.id = a.patient_id
JOIN doctors  d ON d.id = a.doctor_id
WHERE a.id = $1;
```

---

## Rules
- No SQL in controllers or services — only in `src/db/`
- All query functions must be `async` and return plain JS values (not `QueryResult`)
- `findById` returns `null` (not undefined or error) when record is missing
- Do not `SELECT *` in list queries — specify columns explicitly
- Always export functions as named exports, not a default object
