# Skill: Database Indexing

## Purpose
Define the indexing strategy for MediCore's four core tables.

---

## Schema Overview

```
users         → id, name, email, password_hash, role, created_at
patients      → id, user_id (FK), dob, gender, phone
doctors       → id, user_id (FK), specialization, phone, is_available, available_slots (JSONB)
appointments  → id, patient_id (FK), doctor_id (FK), slot_label, slot_time, status, created_at
```

---

## Index Strategy per Table

### `users`
```sql
-- email is UNIQUE — already indexed automatically
-- role filter (e.g. WHERE role = 'doctor') — low cardinality, skip unless table grows large
```

### `patients`
```sql
-- FK — always index
CREATE INDEX idx_patients_user_id ON patients (user_id);
```

### `doctors`
```sql
-- FK
CREATE INDEX idx_doctors_user_id ON doctors (user_id);

-- Filter available doctors (common patient-facing query)
CREATE INDEX idx_doctors_is_available ON doctors (is_available) WHERE is_available = TRUE;

-- Filter by specialization (if search is added later)
CREATE INDEX idx_doctors_specialization ON doctors (specialization);
```

### `appointments`
```sql
-- FK — both sides are queried frequently
CREATE INDEX idx_appointments_patient_id ON appointments (patient_id);
CREATE INDEX idx_appointments_doctor_id  ON appointments (doctor_id);

-- Status filter (pending/approved/rejected tabs)
CREATE INDEX idx_appointments_status ON appointments (status);

-- Chronological ordering
CREATE INDEX idx_appointments_slot_time ON appointments (slot_time DESC);

-- Doctor dashboard: filter by doctor + status together
CREATE INDEX idx_appointments_doctor_status ON appointments (doctor_id, status);
```

---

## When to Add an Index

Add when:
- A column appears in `WHERE`, `JOIN ON`, or `ORDER BY` in frequent queries
- `EXPLAIN ANALYZE` shows a `Seq Scan` on a growing table

Skip when:
- The table has fewer than ~1 000 rows (sequential scan is faster)
- The column is write-only (never filtered or sorted)

---

## Partial Indexes

Use when only a subset of rows is typically queried:

```sql
-- Only available doctors (saves space, faster for patient browse)
CREATE INDEX idx_doctors_available ON doctors (id) WHERE is_available = TRUE;

-- Only pending appointments (doctor action queue)
CREATE INDEX idx_appointments_pending ON appointments (doctor_id) WHERE status = 'pending';
```

---

## EXPLAIN ANALYZE Workflow

```sql
-- Run before and after adding an index
EXPLAIN ANALYZE
SELECT a.*, u.name AS patient_name
FROM appointments a
JOIN patients p ON p.id = a.patient_id
JOIN users    u ON u.id = p.user_id
WHERE a.doctor_id = 2 AND a.status = 'pending';
```

Look for:
- `Seq Scan` on `appointments` → add `idx_appointments_doctor_status`
- High actual rows vs estimated → run `ANALYZE appointments`

---

## Maintenance

```sql
-- Check which indexes are actually being used
SELECT indexrelname, idx_scan
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan ASC;

-- Rebuild a bloated index
REINDEX INDEX idx_appointments_doctor_status;

-- Refresh planner statistics
ANALYZE appointments;
```

---

## Rules

- All foreign key columns (`user_id`, `patient_id`, `doctor_id`) must have an index
- Don't index `available_slots` (JSONB) — it's read as a whole, not filtered in SQL
- Document non-obvious indexes with a comment in `sql/schema.sql`
- Drop indexes with 0 scans in production — they slow down writes for no benefit
