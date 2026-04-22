# Skill: REST API Design

## Purpose
Define consistent standards for API structure, naming, responses, and error handling.

---

## URL Design

### Resource Naming
- Plural nouns for collections: `/patients`, `/doctors`, `/appointments`
- Nested routes for owned sub-resources (max 1 level deep)

```
GET    /patients                    → list all patients
POST   /patients                    → create a patient
GET    /patients/:id                → get one patient
PATCH  /patients/:id                → partial update
DELETE /patients/:id                → delete

GET    /appointments/:id/records    → records for an appointment
POST   /appointments/:id/records    → add a record to an appointment
```

### Avoid
- Verbs in URLs: ❌ `/createPatient`, `/getDoctor`
- Deep nesting: ❌ `/patients/:id/appointments/:apptId/records/:recId`
  - Flatten to: ✅ `/records/:id`

---

## HTTP Methods

| Method | Use case                          | Success status |
|--------|-----------------------------------|----------------|
| GET    | Read resource(s)                  | 200            |
| POST   | Create a new resource             | 201            |
| PATCH  | Partial update                    | 200            |
| PUT    | Full replacement (use sparingly)  | 200            |
| DELETE | Remove resource                   | 200 or 204     |

---

## Response Shape

Always return a consistent envelope:

```json
// Success (single)
{
  "data": { "id": 1, "name": "Jane Doe" }
}

// Success (list)
{
  "data": [ ... ],
  "meta": { "total": 42, "page": 1, "limit": 20 }
}

// Error
{
  "error": "Patient not found",
  "code": "NOT_FOUND"          // optional machine-readable code
}
```

---

## Status Codes

| Code | When to use                                        |
|------|----------------------------------------------------|
| 200  | Successful GET / PATCH / DELETE with body          |
| 201  | Resource created (POST)                            |
| 204  | Success, no content (DELETE with no body)          |
| 400  | Bad request — missing/invalid fields               |
| 401  | Unauthenticated                                    |
| 403  | Authenticated but not authorized                   |
| 404  | Resource not found                                 |
| 409  | Conflict (duplicate, scheduling clash)             |
| 422  | Validation passed structurally but failed logically|
| 500  | Unhandled server error                             |

---

## Pagination

Use `limit` + `offset` for list endpoints.

```
GET /patients?limit=20&offset=0
GET /appointments?limit=10&offset=30
```

Response:
```json
{
  "data": [ ... ],
  "meta": { "total": 120, "limit": 20, "offset": 0 }
}
```

SQL pattern:
```sql
SELECT * FROM patients
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;
```

---

## Filtering & Sorting

```
GET /appointments?doctor_id=3&status=scheduled
GET /patients?sort=last_name&order=asc
```

- Whitelist allowed filter/sort fields in the controller
- Never interpolate query params directly into SQL — always use `$n` params

---

## Rules
- All routes registered in `src/routes/` — never inline in `server.js`
- Always validate inputs before hitting the DB (see `api/validation.md`)
- ID params must be parsed as integers and validated as positive numbers
- Return 404 (not 500) when a record is not found
