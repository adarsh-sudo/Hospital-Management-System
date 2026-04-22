# Skill: Database Indexing

## Purpose
Define indexing strategy for the Hospital Management System to keep queries fast.

---

## Core Tables & Index Strategy

### `patients`
```sql
-- Primary key (auto-indexed)
-- Search by name (partial match)
CREATE INDEX idx_patients_last_name  ON patients (last_name);
CREATE INDEX idx_patients_phone      ON patients (phone);
```

### `doctors`
```sql
-- Filter by specialization
CREATE INDEX idx_doctors_specialization ON doctors (specialization);
-- Filter active doctors
CREATE INDEX idx_doctors_is_active      ON doctors (is_active) WHERE is_active = TRUE;
```

### `appointments`
```sql
-- Most common lookups
CREATE INDEX idx_appointments_patient_id    ON appointments (patient_id);
CREATE INDEX idx_appointments_doctor_id     ON appointments (doctor_id);
CREATE INDEX idx_appointments_scheduled_at  ON appointments (scheduled_at);
CREATE INDEX idx_appointments_status        ON appointments (status);

-- Conflict check query (doctor + time range)
CREATE INDEX idx_appointments_doctor_time
  ON appointments (doctor_id, scheduled_at)
  WHERE status != 'cancelled';
```

### `medical_records`
```sql
-- Lookup records by appointment
CREATE INDEX idx_records_appointment_id ON medical_records (appointment_id);
-- Lookup records by patient (via join optimization)
CREATE INDEX idx_records_created_at ON medical_records (created_at DESC);
```

---

## When to Add an Index

Add an index when:
- A column is used in `WHERE`, `JOIN ON`, or `ORDER BY` in frequent queries
- A column has high cardinality (many distinct values): IDs, timestamps, names
- Query plans (via `EXPLAIN ANALYZE`) show a sequential scan on a large table

Skip indexes on:
- Boolean columns with low cardinality (unless partial index)
- Columns only written to (never filtered/sorted on)
- Small tables (< 1000 rows) — sequential scan is faster

---

## Partial Indexes

Use when only a subset of rows is queried frequently:

```sql
-- Only index active doctors
CREATE INDEX idx_doctors_active ON doctors (id) WHERE is_active = TRUE;

-- Only non-cancelled appointments
CREATE INDEX idx_appts_active ON appointments (doctor_id, scheduled_at)
  WHERE status != 'cancelled';
```

---

## Composite Indexes

Column order matters — put the most selective / equality-matched column first:

```sql
-- Good for: WHERE doctor_id = $1 AND scheduled_at BETWEEN $2 AND $3
CREATE INDEX idx_appts_doctor_time ON appointments (doctor_id, scheduled_at);

-- Bad for: WHERE scheduled_at = $1 (doctor_id not used → index skipped)
```

---

## EXPLAIN ANALYZE Workflow

Run this before and after adding an index to measure impact:

```sql
EXPLAIN ANALYZE
SELECT * FROM appointments
WHERE doctor_id = 3
  AND scheduled_at BETWEEN '2024-01-01' AND '2024-12-31'
  AND status != 'cancelled';
```

Look for:
- `Seq Scan` on large tables → candidate for indexing
- `Index Scan` or `Bitmap Index Scan` → index is being used
- High actual rows vs estimated rows → stale statistics → run `ANALYZE`

---

## Maintenance

```sql
-- Rebuild bloated indexes after bulk deletes/updates
REINDEX INDEX idx_appointments_doctor_time;

-- Update planner statistics
ANALYZE appointments;

-- Check index usage (unused indexes waste write performance)
SELECT indexrelname, idx_scan
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan ASC;
```

---

## Rules
- All foreign key columns must have an index
- Do not add indexes speculatively — profile first with `EXPLAIN ANALYZE`
- Document every non-obvious index with a comment in `sql/schema.sql`
- Unused indexes (0 scans in production) should be dropped
