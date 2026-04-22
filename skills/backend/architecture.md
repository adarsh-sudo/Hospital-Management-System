# Skill: Backend Architecture

## Purpose
Guide all structural and architectural decisions for the Node.js + Express backend.

---

## Project Structure

```
src/
  routes/         → route definitions only (no logic)
  controllers/    → request/response handling
  db/             → raw SQL query functions
  config/
    db.js         → PostgreSQL pool setup
  middlewares/    → auth, error handling, validation
sql/
  schema.sql      → all table definitions
server.js         → entry point
```

---

## Layer Responsibilities

### Routes (`src/routes/`)
- Register endpoints and map to controllers
- Apply middleware (auth, validation) at route level
- No business logic, no SQL

```js
// Good
router.post('/appointments', authenticate, appointmentController.create);

// Bad — logic inside route
router.post('/appointments', async (req, res) => {
  const result = await pool.query('INSERT INTO ...');
});
```

### Controllers (`src/controllers/`)
- Parse and validate `req.body` / `req.params` / `req.query`
- Call DB query functions — never write SQL here
- Format and send the response
- Catch and forward errors via `next(err)`

```js
async function create(req, res, next) {
  try {
    const { patient_id, doctor_id, scheduled_at } = req.body;
    const appointment = await appointmentQueries.create({ patient_id, doctor_id, scheduled_at });
    res.status(201).json({ data: appointment });
  } catch (err) {
    next(err);
  }
}
```

### DB Layer (`src/db/`)
- One file per domain (e.g., `appointments.js`, `patients.js`)
- Export named async functions that run raw SQL via the pool
- No Express objects (`req`, `res`) allowed here

```js
// src/db/appointments.js
async function create({ patient_id, doctor_id, scheduled_at }) {
  const { rows } = await pool.query(
    `INSERT INTO appointments (patient_id, doctor_id, scheduled_at)
     VALUES ($1, $2, $3) RETURNING *`,
    [patient_id, doctor_id, scheduled_at]
  );
  return rows[0];
}
```

---

## Naming Conventions

| Layer       | File pattern          | Example                  |
|-------------|-----------------------|--------------------------|
| Routes      | `<domain>.routes.js`  | `appointments.routes.js` |
| Controllers | `<domain>.js`         | `appointments.js`        |
| DB queries  | `<domain>.js`         | `appointments.js`        |

- Functions: `camelCase`
- DB columns / SQL: `snake_case`
- Constants: `UPPER_SNAKE_CASE`

---

## Server Entry Point (`server.js`)

```js
const express = require('express');
const app = express();

app.use(express.json());

// Routes
app.use('/api/patients',      require('./src/routes/patients.routes'));
app.use('/api/doctors',       require('./src/routes/doctors.routes'));
app.use('/api/appointments',  require('./src/routes/appointments.routes'));

// Global error handler — must be last
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(process.env.PORT || 3000);
```

---

## Rules
- Never skip a layer (e.g., SQL directly in a route)
- Never mix domain logic across layers
- Always use `next(err)` for error propagation — no `res.status(500)` inline
- All new files require explicit user approval before creation
