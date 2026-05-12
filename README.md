# Hospital Management System

**Hospital Management System** is a full-stack web application built with Node.js/Express backend and React frontend, connected to a PostgreSQL database. It provides a role-based portal for patients and doctors: patients can browse available doctors and book appointment slots, while doctors manage their availability and approve or reject incoming appointment requests.

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React + Vite
- **Database**: PostgreSQL (raw SQL)

## Core Features

- **Role-based Authentication**: Separate registration and login flows for patients and doctors
- **Patient Portal**: Browse available doctors, book specific time slots, view booking status
- **Doctor Portal**: Set availability slots, view incoming appointment requests, approve or reject them
- **Appointment Workflow**: Appointments move through `pending` → `approved` / `rejected` states

## Database Schema

The system uses 4 tables:
- `users` - Authentication and role (`patient` or `doctor`)
- `patients` - Patient profile linked to a user account
- `doctors` - Doctor profile with JSONB availability slots and active-status flag
- `appointments` - Booking of a specific slot between a patient and doctor, with status tracking

## Project Structure

```
server.js              # Express entry point

src/
  ├── config/          # Database connection
  ├── controllers/     # Request/response logic
  ├── db/              # Raw SQL queries
  ├── middleware/      # JWT auth and role guards
  └── routes/          # API route definitions

sql/
  ├── schema.sql       # Table definitions
  └── seed.js          # Optional seed data

client/
  ├── src/
  │   ├── components/
  │   │   ├── forms/   # Form components
  │   │   ├── tables/  # Table components
  │   │   ├── layout/  # Navbar, Sidebar, PageWrapper
  │   │   └── ui/      # Reusable primitives (Button, Input, Modal, Badge, Select, Spinner)
  │   ├── pages/
  │   │   ├── patient/ # Patient-specific pages (doctors list, bookings)
  │   │   └── doctor/  # Doctor-specific pages (dashboard, availability)
  │   ├── services/    # API service layers
  │   ├── hooks/       # Custom React hooks
  │   └── utils/       # Auth helpers and utilities
  └── public/          # Static assets
```

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** v14 or higher
- npm v9 or higher

### Installation

**1. Clone the repository**
```bash
git clone <repo-url>
cd hospital-management
```

**2. Install dependencies**
```bash
# Backend
npm install

# Frontend
cd client && npm install && cd ..
```

**3. Set up environment variables**

Create a `.env` file in the project root:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hospital_db
DB_USER=hospital_user
DB_PASSWORD=your_password

PORT=3000
JWT_SECRET=your_jwt_secret_key
```

**4. Set up the database**

Create the database and user in PostgreSQL, then run the schema:
```bash
psql -U postgres -c "CREATE DATABASE hospital_db;"
psql -U postgres -c "CREATE USER hospital_user WITH PASSWORD 'your_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE hospital_db TO hospital_user;"
psql -U hospital_user -d hospital_db -f sql/schema.sql
```

**5. (Optional) Seed the database**
```bash
node sql/seed.js
```

### Running the Application

**Backend** (runs on `http://localhost:3000`):
```bash
npm start
```

**Frontend** (runs on `http://localhost:5173`, in a separate terminal):
```bash
cd client
npm run dev
```
