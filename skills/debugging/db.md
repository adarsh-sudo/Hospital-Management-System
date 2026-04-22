# Skill: Database Debugging

## Purpose
Systematic approach to diagnosing failures at the PostgreSQL and `pg` query layer.

---

## Diagnosis Checklist

```
1. Log the exact SQL and parameters being sent
2. Run the query directly in psql to isolate pg vs logic issues
3. Check the error code / message from PostgreSQL
4. Inspect the table schema and constraints
5. Check for missing migrations or stale schema
```

---

## Step 1: Log the Query Before Execution

```js
async function create({ patient_id, doctor_id, scheduled_at }) {
  const sql    = `INSERT INTO appointments (patient_id, doctor_id, scheduled_at)
                  VALUES ($1, $2, $3) RETURNING *`;
  const params = [patient_id, doctor_id, scheduled_at];

  console.log('[db.appointments.create] SQL:', sql);
  console.log('[db.appointments.create] params:', params);

  const { rows } = await pool.query(sql, params);
  return rows[0];
}
```

---

## Step 2: Run Directly in psql

```bash
psql -h localhost -U postgres -d hospital_db
```

```sql
-- Paste the exact SQL with real values substituted
INSERT INTO appointments (patient_id, doctor_id, scheduled_at)
VALUES (1, 2, '2024-06-01T10:00:00Z') RETURNING *;

-- Inspect the table structure
\d appointments

-- Check constraints
SELECT conname, contype, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'appointments'::regclass;
```

---

## Common DB Errors

### `relation "x" does not exist`
- Table not created — check `sql/schema.sql` was run
- Wrong database selected (check `DB_NAME` in `.env`)

```sql
-- List all tables
\dt
```

### `column "x" does not exist`
- Typo in SQL column name
- Column not added in schema (missing ALTER TABLE migration)

```sql
-- Show columns
\d appointments
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'appointments';
```

### `violates not-null constraint on column "x"`
- A required field is `undefined` or `null` in the query params
- Log params before query to find the missing value

```js
console.log('params:', [patient_id, doctor_id, scheduled_at]);
// If patient_id prints undefined → the caller didn't pass it
```

### `violates foreign key constraint "appointments_patient_id_fkey"`
- The referenced `patient_id` doesn't exist in `patients`
- Verify with:
```sql
SELECT id FROM patients WHERE id = 99;  -- replace with actual ID
```

### `violates unique constraint "x"`
- Duplicate insert — check uniqueness before inserting or use `ON CONFLICT`

```sql
INSERT INTO doctors (email, ...)
VALUES ($1, ...)
ON CONFLICT (email) DO NOTHING
RETURNING *;
```

### `ERROR: invalid input syntax for type integer: "abc"`
- String passed where integer expected — validate ID params before query
- Usually comes from unvalidated `req.params.id` or query string

---

## Checking Query Performance

```sql
-- Run with EXPLAIN ANALYZE for slow queries
EXPLAIN ANALYZE
SELECT a.*, p.first_name, d.last_name
FROM appointments a
JOIN patients p ON p.id = a.patient_id
JOIN doctors  d ON d.id = a.doctor_id
WHERE a.doctor_id = 3 AND a.status = 'scheduled';
```

Look for:
- `Seq Scan` on large tables → add index (see `db/indexing.md`)
- High `actual time` vs `estimated rows` → run `ANALYZE tablename`

---

## Connection Issues

### `ECONNREFUSED`
```bash
# Is PostgreSQL running?
pg_isready -h localhost -p 5432

# Check env vars
node -e "require('dotenv').config(); console.log(process.env)"
```

### Pool exhaustion (requests hanging)
- Too many open queries / missing `client.release()` in transaction blocks
- Increase `max` in pool config temporarily, then fix the leak

```js
// Always release in finally
const client = await pool.connect();
try {
  // ...
} finally {
  client.release();  // ← must always run
}
```

---

## Rules
- Always log SQL + params before a failing query — never guess the values
- Run queries in `psql` to determine if the issue is code or data
- Treat `undefined` parameters as a validation failure, not a DB failure
- Never expose raw PostgreSQL error messages to API consumers — map to clean responses
- Check `\d tablename` before assuming a column or constraint exists
