# Skill: General Debugging

## Purpose
Structured approach to diagnosing and fixing bugs across the MediCore stack.

---

## Debugging Workflow

```
1. Reproduce → 2. Isolate → 3. Hypothesize → 4. Verify → 5. Fix → 6. Confirm
```

### 1. Reproduce
- Get the exact request (endpoint, body, token) or UI action that causes the issue
- Note whether it's consistent or intermittent

### 2. Isolate the Layer
```
Browser (React) → client service (fetch) → Express route → middleware → controller → db layer → PostgreSQL
```
- Use DevTools Network tab to confirm the request shape and response code
- Use `curl` to bypass the frontend and hit the API directly
- Add `console.log` at the controller entry to confirm the request is arriving

### 3. Hypothesize
- List 2–3 possible causes before investigating
- Start with the simplest explanation (wrong token, missing field, wrong route)

### 4. Verify
- Add targeted `console.log` to confirm the hypothesis — check actual values, not assumed ones
- Don't fix until you've confirmed the root cause

### 5. Fix
- Fix the root cause, not the symptom
- Explain the fix before applying it

### 6. Confirm
- Re-run the original failing case
- Check related flows for regressions (e.g., fixing booking shouldn't break doctor dashboard)

---

## Logging Strategy

```js
// Structured format: [module.function] context
console.log('[appointmentsController.bookAppointment]', { user: req.user, body: req.body });

// Always log the full error object
console.error('[db.appointments.createAppointment] error:', err);

// Avoid
console.log('here');        // meaningless
console.log(err.message);  // loses stack trace and pg error code
```

---

## Reading a Stack Trace

```
Error: insert into "appointments" violates foreign key constraint "appointments_doctor_id_fkey"
    at /src/db/appointments.js:24:20     ← first line in your code
    at processTicksAndRejections (...)
```

- Start at the **first file in your code** (not Node internals or `node_modules`)
- The DB error message names the exact constraint — use it to find which param is wrong
- Work up the call stack to find where the bad value originated

---

## Common Error Quick Reference

| Error | First place to check |
|-------|----------------------|
| `Cannot read properties of undefined` | The object before `.x` is null — log it one step earlier |
| `column "x" does not exist` | Typo in SQL or missing migration — run `\d <table>` in psql |
| `violates not-null constraint` | A required param is `undefined` — log the params array |
| `violates foreign key constraint` | Referenced ID doesn't exist — check with a SELECT in psql |
| `ECONNREFUSED` | PostgreSQL not running or wrong `.env` host/port |
| `UnhandledPromiseRejection` | Missing `await` or missing `try/catch` in async controller |
| `Invalid token` (401) | Expired JWT or wrong `JWT_SECRET` — have the user log in again |
| `role showing wrong value` | Old server process still running — kill it and restart |

---

## Environment Checks

```bash
# Confirm env vars are loaded
node -e "require('dotenv').config(); console.log(process.env.DB_NAME, process.env.JWT_SECRET)"

# Check DB is reachable
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1"

# Confirm backend is running on the right port
curl http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"arjun.mehta@medicore.com","password":"password123"}'
```

---

## Stale Process Issue (past incident)

If API responses look correct in code but return wrong data (e.g., role = `'clerk'`), an **old Node process** may still be running. Fix:

```bash
# Find and kill the old process
lsof -i :5000        # or use Task Manager on Windows
kill <PID>
node server.js       # restart
```

---

## Rules

- Never guess-and-fix — reproduce and verify first
- Do not push a fix without identifying the root cause
- If the bug is intermittent, add logging before fixing
- Always inspect the full `err` object, not just `err.message`
- Use `curl` to isolate API issues before debugging the React frontend
