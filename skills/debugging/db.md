# Skill: Database Debugging

## Purpose
Systematic approach to diagnosing failures at the PostgreSQL and `pg` query layer in MediCore.

---

## Diagnosis Checklist

```
1. Log the exact SQL and parameters before the failing query
2. Run the query directly in psql with real values
3. Read the PostgreSQL error code and message carefully
4. Inspect the table schema with \d <table>
5. Check for stale schema (was schema.sql re-applied after a change?)
```

---

## Step 1: Log Before Executing

```js
async function createAppointment({ patient_id, doctor_id, slot_label, slot_time }) {
  console.log('[db.appointments.createAppointment] params:', { patient_id, doctor_id, slot_label, slot_time });
  const { rows } = await pool.query(
    `INSERT INTO appointments (patient_id, doctor_id, slot_label, slot_time)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [patient_id, doctor_id, slot_label, slot_time]
  );
  return rows[0];
}
```

---

## Step 2: Run Directly in psql

```bash
psql -h localhost -U <DB_USER> -d <DB_NAME>
```

```sql
-- Substitute real values and run
INSERT INTO appointments (patient_id, doctor_id, slot_label, slot_time)
VALUES (3, 1, 'Tue, Apr 28, 2026 · 09:00–10:00', '2026-04-28T09:00:00') RETURNING *;

-- Inspect schema
\d appointments
\d doctors
\d users

-- Check all tables exist
\dt
```

---

## Common DB Errors

### `relation "x" does not exist`
- `sql/schema.sql` was not applied to the current database
- Wrong database selected — check `DB_NAME` in `.env`

```sql
\dt   -- list all tables; if empty, schema hasn't been run
```

### `column "x" does not exist`
- Typo in the SQL column name in `src/db/`
- Column added to `schema.sql` but the DB wasn't recreated/migrated

```sql
\d appointments   -- shows all columns and their types
```

### `violates not-null constraint on column "x"`
- A parameter is `undefined` or `null` — log params before the query
- Common cause: `req.user.profile_id` is missing because user logged in before `profile_id` was embedded in the JWT. Fix: have the user log in again.

### `violates foreign key constraint`
```sql
-- Check the referenced row exists
SELECT id FROM doctors WHERE id = 2;
SELECT id FROM patients WHERE id = 5;
```

### `violates unique constraint "users_email_key"`
- Duplicate registration — return 409, not 500

```js
if (err.code === '23505') return res.status(409).json({ error: 'Email already registered' });
```

### `invalid input syntax for type integer: "abc"`
- String passed where integer expected — `parseInt(req.params.id, 10)` before use in SQL

### JSONB — `available_slots` reads as string instead of array
- `pg` returns JSONB columns already parsed as JS objects — do **not** call `JSON.parse()`
- When writing, always call `JSON.stringify(slots)` before passing to the query

```js
// Writing
pool.query(`UPDATE doctors SET available_slots = $1 ...`, [JSON.stringify(slots)]);

// Reading — already a JS array, no JSON.parse needed
const slots = rows[0].available_slots;
```

---

## Connection Issues

### `ECONNREFUSED`
```bash
# Is PostgreSQL running?
pg_isready -h localhost -p 5432

# Check env vars are loaded
node -e "require('dotenv').config(); console.log(process.env.DB_NAME, process.env.DB_USER)"
```

### Pool exhaustion (requests hang indefinitely)
- A transaction acquired a client but never called `client.release()`
- Always release in `finally`:

```js
const client = await pool.connect();
try {
  // ...
} finally {
  client.release();  // must always run
}
```

---

## Checking Query Performance

```sql
EXPLAIN ANALYZE
SELECT a.*, u.name AS patient_name
FROM appointments a
JOIN patients p ON p.id = a.patient_id
JOIN users    u ON u.id = p.user_id
WHERE a.doctor_id = 1 AND a.status = 'pending';
```

`Seq Scan` on a growing `appointments` table → add `idx_appointments_doctor_status` (see `db/indexing.md`).

---

## Rules

- Always log SQL + params before a failing query — never guess parameter values
- Run queries in psql to isolate whether the issue is code or data
- Treat `undefined` parameters as a controller validation failure, not a DB problem
- Never expose raw PostgreSQL error messages to the client — map to a clean `{ error: "..." }` response
- Check `\d <table>` before assuming a column or constraint exists
