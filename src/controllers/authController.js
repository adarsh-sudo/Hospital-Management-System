const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const pool   = require('../config/db');
const usersDb    = require('../db/users');
const patientsDb = require('../db/patients');
const doctorsDb  = require('../db/doctors');

const SALT_ROUNDS = 10;

function signToken({ id, email, name, role }, profile_id) {
  return jwt.sign(
    { id, email, name, role, profile_id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function register(req, res) {
  const { name, email, password, role } = req.body;

  if (!name)     return res.status(400).json({ error: 'Name is required' });
  if (!email)    return res.status(400).json({ error: 'Email is required' });
  if (!password) return res.status(400).json({ error: 'Password is required' });
  if (!role || !['patient', 'doctor'].includes(role)) {
    return res.status(400).json({ error: 'Role must be patient or doctor' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const existing = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows[0]) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const userResult = await client.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
      [name, email, password_hash, role]
    );
    const user = userResult.rows[0];

    let profile_id;
    if (role === 'patient') {
      const p = await client.query('INSERT INTO patients (user_id) VALUES ($1) RETURNING id', [user.id]);
      profile_id = p.rows[0].id;
    } else {
      const d = await client.query('INSERT INTO doctors (user_id) VALUES ($1) RETURNING id', [user.id]);
      profile_id = d.rows[0].id;
    }

    await client.query('COMMIT');

    const token = signToken(user, profile_id);
    res.status(201).json({ token, user: { ...user, profile_id } });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email)    return res.status(400).json({ error: 'Email is required' });
  if (!password) return res.status(400).json({ error: 'Password is required' });

  try {
    const user = await usersDb.findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    let profile_id;
    if (user.role === 'patient') {
      const patient = await patientsDb.getPatientByUserId(user.id);
      profile_id = patient?.id;
    } else {
      const doctor = await doctorsDb.getDoctorByUserId(user.id);
      profile_id = doctor?.id;
    }

    const token = signToken(user, profile_id);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, profile_id } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { register, login };
