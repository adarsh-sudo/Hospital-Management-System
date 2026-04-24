# Skill: Backend Architecture

## Purpose
Guide all structural and architectural decisions for the MediCore Express backend.

---

## Project Structure

```
src/
  routes/         → route definitions + middleware wiring
  controllers/    → request handling, calls db layer
  db/             → raw SQL query functions (one file per domain)
  middleware/
    auth.js       → requireAuth, requireRole
  config/
    db.js         → PostgreSQL pool
sql/
  schema.sql      → all table definitions
  seed.js         → dummy data script
server.js         → entry point, mounts routes
```

---

## Route Groups (server.js)

```js
app.use('/api/auth',         require('./src/routes/auth'));
app.use('/api/doctors',      require('./src/routes/doctors'));
app.use('/api/appointments', require('./src/routes/appointments'));
app.use('/api/patients',     require('./src/routes/patients'));
```

Public: `/api/auth` only. All other routes require JWT via `requireAuth`.

---

## Auth Middleware (`src/middleware/auth.js`)

```js
function requireAuth(req, res, next)       // verifies JWT, sets req.user
function requireRole(role)                 // checks req.user.role === role
```

`req.user` shape after `requireAuth`:
```js
{ id, email, name, role, profile_id }
// profile_id → patients.id or doctors.id depending on role
```

`profile_id` is embedded in the JWT at registration/login — no extra DB lookup needed in controllers.

---

## Layer Responsibilities

### Routes (`src/routes/`)
- Register endpoints, attach middleware, map to controller functions
- No business logic, no SQL

```js
router.get('/me',   requireAuth, requireRole('doctor'), ctrl.getMyProfile);
router.patch('/me', requireAuth, requireRole('doctor'), ctrl.updateMyProfile);
```

### Controllers (`src/controllers/`)
- Validate `req.body` / `req.params` inline at the top
- Call db functions — never write SQL here
- Send the response directly (no envelope wrapper)

```js
async function bookAppointment(req, res) {
  const { doctor_id, slot_label, slot_time } = req.body;
  if (!doctor_id || !slot_label || !slot_time)
    return res.status(400).json({ error: 'Missing required fields' });
  const appt = await appointmentsDb.createAppointment({ ... });
  res.status(201).json(appt);
}
```

### DB Layer (`src/db/`)
- Files: `users.js`, `patients.js`, `doctors.js`, `appointments.js`
- Export named async functions only
- No `req` / `res` — pure SQL in, plain JS out

---

## Transactions

Use `pool.connect()` when multiple writes must be atomic (e.g., registration):

```js
const client = await pool.connect();
try {
  await client.query('BEGIN');
  // insert user + insert patient/doctor profile
  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
} finally {
  client.release();
}
```

---

## Naming Conventions

| Layer       | File              | Example                      |
|-------------|-------------------|------------------------------|
| Routes      | `<domain>.js`     | `src/routes/appointments.js` |
| Controllers | `<domain>Controller.js` | `src/controllers/appointmentsController.js` |
| DB queries  | `<domain>.js`     | `src/db/appointments.js`     |

- Functions: `camelCase`
- DB columns / SQL: `snake_case`
- Constants: `UPPER_SNAKE_CASE`

---

## Rules

- Never write SQL in a controller — delegate to `src/db/`
- Never skip `requireAuth` on protected routes
- Use `profile_id` from `req.user` (not a separate DB lookup) to identify the caller's patient/doctor row
- All new files require explicit user approval before creation
