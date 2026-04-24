# Hospital Management System

**Hospital Management System** is a full-stack web application built with Node.js/Express backend and React frontend, connected to a PostgreSQL database. It enables hospitals to manage core operations including patient registration, doctor profiles organized by departments, appointment scheduling between patients and doctors, and comprehensive medical records with diagnoses and clinical notes per appointment. The system uses raw SQL queries for database operations and includes user authentication for secure access.

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React + Vite
- **Database**: PostgreSQL (raw SQL)

## Core Features

- **User Authentication**: Secure login and registration
- **Patient Management**: Register and manage patient profiles
- **Doctor Management**: Manage doctor profiles organized by departments
- **Appointments**: Schedule and track appointments between patients and doctors
- **Medical Records**: Store diagnosis and clinical notes per appointment
- **Department Organization**: Organize doctors by departments

## Database Schema

The system uses 6 core tables:
- `users` - User authentication
- `patients` - Patient information
- `doctors` - Doctor profiles linked to departments
- `departments` - Hospital departments
- `appointments` - Links patients and doctors
- `medical_records` - Diagnosis and notes per appointment

## Project Structure

```
src/
  ├── config/         # Database configuration
  ├── controllers/    # Request/response logic
  ├── db/            # Raw SQL queries
  ├── middleware/    # Authentication middleware
  └── routes/        # API route definitions

client/
  ├── src/
  │   ├── components/  # React components (forms, tables, layouts)
  │   ├── pages/      # Page components
  │   ├── services/   # API service layers
  │   ├── hooks/      # Custom React hooks
  │   └── utils/      # Utility functions
  └── public/         # Static assets
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
