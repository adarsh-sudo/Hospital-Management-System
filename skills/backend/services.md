# Skill: Backend Transactions & Multi-Step Logic

## Purpose
Define how multi-step database operations are handled in MediCore. This project does not use a services layer — complex logic lives in controllers and uses transactions directly.

---

## When to Use a Transaction

Use `pool.connect()` + `BEGIN/COMMIT/ROLLBACK` when two or more writes must succeed or fail together.

Current uses:
- **Registration** — insert into `users` then insert into `patients` or `doctors`. If the profile insert fails, the user row is rolled back.

---

## Transaction Pattern

```js
const pool = require('../config/db');

const client = await pool.connect();
try {
  await client.query('BEGIN');

  const { rows: [user] } = await client.query(
    `INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING *`,
    [name, email, hash, role]
  );

  if (role === 'patient') {
    await client.query(`INSERT INTO patients (user_id) VALUES ($1)`, [user.id]);
  } else {
    await client.query(`INSERT INTO doctors (user_id) VALUES ($1)`, [user.id]);
  }

  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
} finally {
  client.release();   // always release, even on error
}
```

---

## Single-Write Operations

If the operation is a single DB call, write it directly in the controller via the `src/db/` layer — no transaction needed.

```js
// Controller — single write, no transaction
const appt = await appointmentsDb.createAppointment({ patient_id, doctor_id, slot_label, slot_time });
res.status(201).json(appt);
```

---

## Error Handling

Throw plain `Error` objects with a `.status` property for HTTP-mappable errors inside multi-step logic:

```js
const err = new Error('Email already registered');
err.status = 409;
throw err;
```

The controller catches and maps these:

```js
} catch (err) {
  res.status(err.status || 500).json({ error: err.message });
}
```

---

## Rules

- Always `client.release()` in a `finally` block — missing releases exhaust the pool
- Never import `req` / `res` into the DB layer
- Only use transactions when writes span multiple tables
- For single-table reads/writes, use the pool directly (`pool.query(...)`)
