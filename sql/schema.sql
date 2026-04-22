-- Users (authentication)
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'clerk',
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Departments (support table for doctor linkage)
CREATE TABLE IF NOT EXISTS departments (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Patients
CREATE TABLE IF NOT EXISTS patients (
  id     SERIAL PRIMARY KEY,
  name   VARCHAR(100) NOT NULL,
  dob    DATE,
  gender VARCHAR(10),
  phone  VARCHAR(20),
  email  VARCHAR(100)
);

-- Doctors (linked to department)
CREATE TABLE IF NOT EXISTS doctors (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  specialization VARCHAR(100),
  phone          VARCHAR(20),
  email          VARCHAR(100),
  department_id  INT REFERENCES departments(id)
);

-- Appointments (links patients + doctors)
CREATE TABLE IF NOT EXISTS appointments (
  id         SERIAL PRIMARY KEY,
  patient_id INT REFERENCES patients(id),
  doctor_id  INT REFERENCES doctors(id),
  date       TIMESTAMP NOT NULL,
  status     VARCHAR(20) DEFAULT 'scheduled'
);

-- Medical Records (per appointment)
CREATE TABLE IF NOT EXISTS medical_records (
  id             SERIAL PRIMARY KEY,
  appointment_id INT REFERENCES appointments(id),
  diagnosis      TEXT,
  notes          TEXT,
  created_at     TIMESTAMP DEFAULT NOW()
);
