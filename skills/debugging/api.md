# Skill: API Debugging

## Purpose
Systematic approach to diagnosing failures at the Express route and controller layer.

---

## Diagnosis Checklist

When an API endpoint fails, work through this order:

```
1. Check HTTP method and URL match the route definition
2. Check request body / params are reaching the controller
3. Check middleware (auth, validation) isn't blocking early
4. Check the controller is calling the right function
5. Check the service/DB response before it's sent
6. Check the response shape matches what the client expects
```

---

## Logging Incoming Requests

Add temporary debug middleware to inspect what's arriving:

```js
// Temporary — remove after debugging
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`, {
    body:    req.body,
    params:  req.params,
    query:   req.query,
    headers: req.headers['content-type'],
  });
  next();
});
```

---

## Common API Errors

### `404 Cannot GET /api/patients`
- Route not registered in `server.js`
- Prefix mismatch: route file uses `/` but mounted as `/api/patients/:id`
- HTTP method mismatch (GET vs POST)

```js
// Check
app.use('/api/patients', require('./src/routes/patients.routes'));
router.get('/:id', controller.getById);  // maps to GET /api/patients/:id
```

### `400 Bad Request` (unexpected)
- Validation middleware rejecting a field that should be optional
- `req.body` is empty → `express.json()` middleware missing
- Sending `Content-Type: text/plain` instead of `application/json`

```js
// Verify express.json() is registered before routes
app.use(express.json());
```

### `500 Internal Server Error` with no detail
- Unhandled error not forwarded via `next(err)`
- Global error handler not reached (middleware order wrong)

```js
// Global error handler must be last
app.use('/api/...', routes);
app.use((err, req, res, next) => {   // ← must come after all routes
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});
```

### Response body is `{}` or missing fields
- Controller sending `res.json(result)` where `result` is undefined
- `RETURNING *` missing from INSERT query → `rows[0]` is undefined

```js
// Debug: log before sending
console.log('[controller] about to send:', result);
res.status(201).json({ data: result });
```

---

## Testing Endpoints Manually

```bash
# GET with query params
curl "http://localhost:3000/api/appointments?doctor_id=2&status=scheduled"

# POST with JSON body
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{"patient_id": 1, "doctor_id": 2, "scheduled_at": "2024-06-01T10:00:00Z"}'

# PATCH
curl -X PATCH http://localhost:3000/api/patients/5 \
  -H "Content-Type: application/json" \
  -d '{"phone": "+91-9876543210"}'
```

---

## Middleware Order Debugging

Express runs middleware in registration order. If something is blocked:

```js
// Log which middleware runs
function trace(name) {
  return (req, res, next) => { console.log('MIDDLEWARE:', name); next(); };
}

router.post('/', trace('validate'), validate(schema), trace('controller'), controller.create);
```

---

## Rules
- Never suppress errors with empty `catch {}` blocks
- Always `next(err)` in async controllers — don't swallow and send 500 inline
- Validate `Content-Type` header when debugging empty `req.body`
- Use `curl` or Postman to isolate whether the issue is client-side or server-side
