# Skill: Frontend Components

## Stack
- React (functional components + hooks only)
- Tailwind CSS (utility classes only)

---

## Folder Structure

```
src/
  components/
    ui/         → small reusable pieces (Button, Input, Modal, Badge, Spinner, Select)
    forms/      → one form per domain entity
    tables/     → one table per domain entity
    layout/     → Navbar, Sidebar, PageWrapper
  pages/        → one file per route, composes components
  hooks/        → one custom hook per domain for fetching + state
  services/     → API call functions, one file per domain
```

---

## Component Rules

- One component per file
- No API calls inside components — use hooks and services instead
- No business logic inside JSX — extract to a variable above the return
- Every form must handle: loading, field errors, submit error, success callback
- Every table must handle: loading, empty, error states

---

## UI Components (`src/components/ui/`)

Small, stateless, reusable. No API calls. Accept props only.

Components to have: Button, Input, Select, Modal, Badge, Spinner, Pagination

---

## Forms (`src/components/forms/`)

One form per domain. Handles local state, validation, and submission via service.

Forms to build:
- `PatientForm.jsx` — create / edit a patient
- `DoctorForm.jsx` — create / edit a doctor
- `AppointmentForm.jsx` — book an appointment (doctor + patient dropdowns + datetime)
- `MedicalRecordForm.jsx` — add diagnosis notes to an appointment

---

## Tables (`src/components/tables/`)

Display paginated lists with edit and delete actions per row.

Tables to build:
- `PatientTable.jsx`
- `DoctorTable.jsx`
- `AppointmentTable.jsx` — include status badge per row
- `MedicalRecordTable.jsx`

---

## Layout (`src/components/layout/`)

- `Navbar.jsx` — top bar with app name and nav links
- `Sidebar.jsx` — links to Patients, Doctors, Appointments
- `PageWrapper.jsx` — consistent padding and max-width for all pages

---

## Pages (`src/pages/`)

One file per route. Composes components only — no logic beyond modal open/close state.

| File | Route |
|------|-------|
| `PatientsPage.jsx` | `/patients` |
| `DoctorsPage.jsx` | `/doctors` |
| `AppointmentsPage.jsx` | `/appointments` |
| `AppointmentDetailPage.jsx` | `/appointments/:id` |

---

## Hooks (`src/hooks/`)

One hook per domain. Owns fetching, pagination state, and refetch.

Hooks to build: `usePatients`, `useDoctors`, `useAppointments`, `useMedicalRecords`

---

## Services (`src/services/`)

Pure async functions — no React, no state. One file per domain.
Each service covers: getAll, getById, create, update, remove.

Services to build: `patient.service.js`, `doctor.service.js`, `appointment.service.js`, `medicalRecord.service.js`

---

## Tailwind Conventions

- Primary action color: blue-600
- Danger color: red-600
- Backgrounds: gray-50 / gray-100
- Always include focus and disabled states on interactive elements
- Consistent spacing: use `space-y-4` for forms, `gap-4` for grids

---

## Rules
- No new component without explicit user approval
- Always present what you plan to build and wait for confirmation
- Follow folder structure strictly — no files outside defined locations