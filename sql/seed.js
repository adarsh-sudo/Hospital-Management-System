require('dotenv').config();
const bcrypt = require('bcrypt');
const pool   = require('../src/config/db');

const SALT_ROUNDS = 10;
const PASSWORD    = 'password123';

const doctors = [
  { name: 'Dr. Arjun Mehta',    email: 'arjun.mehta@medicore.com',    specialization: 'Cardiology',       phone: '+91 98201 11001', is_available: true },
  { name: 'Dr. Priya Sharma',   email: 'priya.sharma@medicore.com',   specialization: 'Dermatology',      phone: '+91 98201 11002', is_available: true },
  { name: 'Dr. Rohan Desai',    email: 'rohan.desai@medicore.com',    specialization: 'Neurology',        phone: '+91 98201 11003', is_available: false },
  { name: 'Dr. Sneha Kapoor',   email: 'sneha.kapoor@medicore.com',   specialization: 'Orthopedics',      phone: '+91 98201 11004', is_available: true },
  { name: 'Dr. Vikram Nair',    email: 'vikram.nair@medicore.com',    specialization: 'General Practice', phone: '+91 98201 11005', is_available: true },
  { name: 'Dr. Ananya Iyer',    email: 'ananya.iyer@medicore.com',    specialization: 'Pediatrics',       phone: '+91 98201 11006', is_available: false },
];

const patients = [
  { name: 'Rahul Gupta',   email: 'rahul.gupta@mail.com',   dob: '1990-03-15', gender: 'male',   phone: '+91 99001 21001' },
  { name: 'Meera Joshi',   email: 'meera.joshi@mail.com',   dob: '1995-07-22', gender: 'female', phone: '+91 99001 21002' },
  { name: 'Kiran Rao',     email: 'kiran.rao@mail.com',     dob: '1988-11-05', gender: 'male',   phone: '+91 99001 21003' },
  { name: 'Pooja Singh',   email: 'pooja.singh@mail.com',   dob: '1992-01-30', gender: 'female', phone: '+91 99001 21004' },
  { name: 'Amit Tiwari',   email: 'amit.tiwari@mail.com',   dob: '1985-09-18', gender: 'male',   phone: '+91 99001 21005' },
  { name: 'Divya Menon',   email: 'divya.menon@mail.com',   dob: '1998-06-12', gender: 'female', phone: '+91 99001 21006' },
];

// Future dates relative to today
function futureDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

// Each available doctor gets 3 slots spread over the next 2 weeks
function buildSlots(doctorIndex) {
  const offsets = [2, 5, 9];
  return offsets.map((offset, i) => ({
    date:  futureDate(offset + doctorIndex),
    start: ['09:00', '11:00', '14:00'][i],
    end:   ['10:00', '12:00', '15:00'][i],
  }));
}

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const hash = await bcrypt.hash(PASSWORD, SALT_ROUNDS);

    // ── Insert doctors ────────────────────────────────────────────────────────
    for (let i = 0; i < doctors.length; i++) {
      const doc = doctors[i];
      const { rows } = await client.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, 'doctor')
         ON CONFLICT (email) DO NOTHING
         RETURNING id`,
        [doc.name, doc.email, hash]
      );
      if (!rows[0]) { console.log(`Skipped (exists): ${doc.email}`); continue; }

      const userId = rows[0].id;
      const slots  = doc.is_available ? buildSlots(i) : [];

      await client.query(
        `INSERT INTO doctors (user_id, specialization, phone, is_available, available_slots)
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, doc.specialization, doc.phone, doc.is_available, JSON.stringify(slots)]
      );
      console.log(`Created doctor: ${doc.name}`);
    }

    // ── Insert patients ───────────────────────────────────────────────────────
    for (const pt of patients) {
      const { rows } = await client.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, 'patient')
         ON CONFLICT (email) DO NOTHING
         RETURNING id`,
        [pt.name, pt.email, hash]
      );
      if (!rows[0]) { console.log(`Skipped (exists): ${pt.email}`); continue; }

      await client.query(
        `INSERT INTO patients (user_id, dob, gender, phone)
         VALUES ($1, $2, $3, $4)`,
        [rows[0].id, pt.dob, pt.gender, pt.phone]
      );
      console.log(`Created patient: ${pt.name}`);
    }

    await client.query('COMMIT');
    console.log('\nSeed complete. All accounts use password: password123');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
