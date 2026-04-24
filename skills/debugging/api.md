# Skill: API Debugging

## Purpose
Systematic approach to diagnosing failures at the Express route and controller layer in MediCore.

---

## Diagnosis Checklist

```
1. Check HTTP method and URL match the route definition (see api/rest.md)
2. Check the Authorization header is present and valid
3. Check req.body is populated (Content-Type: application/json required)
4. Check middleware order — requireAuth runs before requireRole
5. Check the controller is calling the correct db function
6. Check the response shape matches what the client service expects
```

---

## Testing Endpoints with curl

```bash
# Register a patient
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@mail.com","password":"password123","role":"patient"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@mail.com","password":"password123"}'

# List all doctors (patient token required)
curl http://localhost:5000/api/doctors \
  -H "Authorization: Bearer <token>"

# Book an appointment
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <patient-token>" \
  -d '{"doctor_id":1,"slot_label":"Tue, Apr 28 · 09:00–10:00","slot_time":"2026-04-28T09:00:00"}'

# Doctor approves an appointment
curl -X PATCH http://localhost:5000/api/appointments/3/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <doctor-token>" \
  -d '{"status":"approved"}'
```

---

## Common Errors

### `401 Unauthorized`
- `Authorization` header missing or token expired
- Token signed with wrong `JWT_SECRET` (check `.env`)

```js
// src/middleware/auth.js — verify logs the error
jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  if (err) return res.status(401).json({ error: 'Invalid token' });
  req.user = decoded;
  next();
});
```

### `403 Forbidden`
- Correct token, wrong role — e.g. patient hitting a doctor-only route
- Check `requireRole('doctor')` is on the right route in `src/routes/`

### `404 Cannot GET /api/doctors`
- Route not mounted in `server.js`
- Prefix mismatch: route file uses `/available` but mounted path doesn't match

### `400 Bad Request` (unexpected)
- `req.body` is `{}` → `express.json()` missing or `Content-Type` not set
- Required field absent — check controller validation at top of function

### `500 Internal Server Error`
- Unhandled promise rejection — missing `try/catch` in controller
- `req.user.profile_id` is undefined — token was issued before `profile_id` was added; user must re-login

---

## Debug Logging

Add temporarily at the top of a controller:

```js
console.log('[bookAppointment] user:', req.user);
console.log('[bookAppointment] body:', req.body);
```

Structured format: `[controllerName] message`, then the relevant data.

---

## Middleware Order

Express runs middleware in registration order. If a route is blocked:

```js
// Correct order
router.post('/', requireAuth, requireRole('patient'), ctrl.bookAppointment);

// Common mistake — role check before auth sets req.user
router.post('/', requireRole('patient'), requireAuth, ctrl.bookAppointment);
// → req.user is undefined inside requireRole → crashes
```

---

## Rules

- Never suppress errors with empty `catch {}` blocks
- Always use `try/catch` in async controllers — unhandled rejections crash the request
- Validate `Content-Type: application/json` when `req.body` is empty
- Use `curl` or Postman to confirm the issue is server-side before debugging React
