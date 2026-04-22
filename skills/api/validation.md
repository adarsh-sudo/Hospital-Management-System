# Skill: API Validation

## Purpose
Define where, how, and what to validate for all incoming API requests.

---

## Where Validation Happens

```
Request → Route middleware → Controller → DB layer
              ↑
         validate here
```

- **Structural validation** (required fields, types, formats) → middleware or top of controller
- **Business validation** (doctor exists, slot free) → service layer
- **Never** validate in the DB query layer

---

## Validation Middleware (recommended pattern)

Use a simple hand-rolled validator or `express-validator`. 
Below is the lightweight in-house approach aligned with raw SQL style:

```js
// src/middlewares/validate.js
function validate(schema) {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];

      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }

      if (value !== undefined) {
        if (rules.type === 'integer' && !Number.isInteger(Number(value))) {
          errors.push(`${field} must be an integer`);
        }
        if (rules.type === 'string' && typeof value !== 'string') {
          errors.push(`${field} must be a string`);
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${field} must be at most ${rules.maxLength} characters`);
        }
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push(`${field} has an invalid format`);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') });
    }

    next();
  };
}

module.exports = validate;
```

---

## Using Validation in Routes

```js
// src/routes/appointments.routes.js
const validate = require('../middlewares/validate');

const appointmentSchema = {
  patient_id:   { required: true,  type: 'integer' },
  doctor_id:    { required: true,  type: 'integer' },
  scheduled_at: { required: true,  type: 'string', pattern: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/ },
};

router.post('/', validate(appointmentSchema), appointmentController.create);
```

---

## ID Parameter Validation

Always validate `:id` params at the controller level:

```js
function getById(req, res, next) {
  const id = parseInt(req.params.id, 10);
  if (!id || id < 1) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  // proceed
}
```

---

## Common Validation Rules

| Field          | Rule                                         |
|----------------|----------------------------------------------|
| `patient_id`   | Required, positive integer                   |
| `doctor_id`    | Required, positive integer                   |
| `scheduled_at` | Required, ISO 8601 datetime string           |
| `name`         | Required, string, max 100 chars              |
| `phone`        | Optional, string, pattern `/^\+?[\d\s\-]+$/`|
| `email`        | Optional, pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| `diagnosis`    | Required for medical records, string, max 2000 |

---

## What NOT to Do

```js
// Bad — trusting raw user input in SQL
pool.query(`SELECT * FROM patients WHERE name = '${req.body.name}'`);

// Bad — validating inside DB layer
async function create(data) {
  if (!data.patient_id) throw new Error('Missing patient_id'); // too late
}

// Bad — generic 500 for missing fields
if (!req.body.patient_id) {
  return res.status(500).json({ error: 'Error' });
}
```

---

## Rules
- All inputs must be validated before any DB call
- Never trust `req.body` types — always coerce/check explicitly
- Return 400 for structural errors, not 422 or 500
- Validation errors should list all invalid fields, not just the first
- Query param filters must be whitelisted before use in SQL
