-- Users (authentication — role is 'patient' or 'doctor')
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Patient profiles (linked 1-to-1 with users where role='patient')
CREATE TABLE IF NOT EXISTS patients (
  id      SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  dob     DATE,
  gender  VARCHAR(10),
  phone   VARCHAR(20)
);

-- Doctor profiles (linked 1-to-1 with users where role='doctor')
-- available_slots: JSONB array e.g. [{"day":"Monday","start":"09:00","end":"11:00"}]
CREATE TABLE IF NOT EXISTS doctors (
  id               SERIAL PRIMARY KEY,
  user_id          INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  specialization   VARCHAR(100),
  phone            VARCHAR(20),
  is_available     BOOLEAN DEFAULT false,
  available_slots  JSONB DEFAULT '[]'
);

-- Appointments (patient books a specific slot with a doctor)
CREATE TABLE IF NOT EXISTS appointments (
  id           SERIAL PRIMARY KEY,
  patient_id   INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id    INT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  slot_label   VARCHAR(100) NOT NULL,  -- human-readable e.g. "Monday 09:00–11:00"
  slot_time    TIMESTAMP NOT NULL,      -- actual booked datetime
  status       VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at   TIMESTAMP DEFAULT NOW()
);
