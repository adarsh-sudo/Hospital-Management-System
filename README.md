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
- Node.js
- PostgreSQL

### Installation

1. Clone the repository
2. Install backend dependencies: `npm install`
3. Install frontend dependencies: `cd client && npm install`
4. Set up PostgreSQL and run the schema: `sql/schema.sql`
5. Configure database connection in `src/config/db.js`

### Running the Application

**Backend**:
```bash
npm start
```

**Frontend** (in another terminal):
```bash
cd client
npm run dev
```
