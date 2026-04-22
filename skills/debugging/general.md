# Skill: General Debugging

## Purpose
Define a structured, systematic approach to diagnosing and fixing bugs.

---

## Debugging Workflow

```
1. Reproduce → 2. Isolate → 3. Hypothesize → 4. Verify → 5. Fix → 6. Confirm
```

### 1. Reproduce
- Get the exact input / request that causes the issue
- Identify whether it's consistent or intermittent
- Note the environment: dev / staging / prod

### 2. Isolate
- Which layer fails? Route → Controller → Service → DB
- Narrow down using logs or minimal test cases
- Comment out or stub parts to find the boundary

### 3. Hypothesize
- What's the simplest explanation?
- List 2–3 possible causes before investigating

### 4. Verify
- Add targeted `console.log` or use a debugger to confirm the hypothesis
- Check actual values, not assumed ones

### 5. Fix
- Fix the root cause, not the symptom
- Present the fix with explanation before applying

### 6. Confirm
- Re-run the original failing case
- Check for regressions in related flows

---

## Logging Strategy

```js
// Development: structured log with context
console.log('[appointments.create]', { body: req.body, userId: req.user?.id });

// Error logging — always include the full error
console.error('[appointments.create] DB error:', err);

// Avoid
console.log('here');        // meaningless
console.log(err.message);  // loses stack trace
```

Structured format: `[module.function] message`, followed by relevant data object.

---

## Reading a Stack Trace

```
Error: insert or update on table "appointments" violates foreign key constraint
    at /src/db/appointments.js:18:20     ← where the error surfaced in your code
    at processTicksAndRejections (...)
```

- Start at the **first line in your code** (not Node internals)
- Work upward through the call stack to find the call site
- Check the DB error message first — it often names the exact constraint or column

---

## Common Error Types

| Error | First place to check |
|-------|----------------------|
| `Cannot read property 'x' of undefined` | The object before `.x` is null/undefined — log it |
| `column "x" does not exist` | Typo in SQL column name or missing migration |
| `violates not-null constraint` | Required field not being passed to query |
| `violates foreign key constraint` | Referenced ID doesn't exist in parent table |
| `ECONNREFUSED` | DB not running or wrong host/port in `.env` |
| `UnhandledPromiseRejection` | Missing `await` or missing `try/catch` |
| `SyntaxError: Unexpected token` | JSON parse error — log raw body |

---

## Environment & Config Issues

```bash
# Verify env vars are loaded
node -e "require('dotenv').config(); console.log(process.env.DB_NAME)"

# Check DB connectivity
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1"

# Confirm port is open
curl http://localhost:3000/api/patients
```

---

## Rules
- Never guess-and-fix — always reproduce and verify first
- Do not push a fix without explaining the root cause
- If an error is intermittent, add logging before fixing
- Always check the full error object, not just `err.message`
- Ask for clarification if the bug report lacks reproduction steps
