const db = require('../db/departments');

async function getAllDepartments(req, res) {
  try {
    const departments = await db.getAllDepartments();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDepartmentById(req, res) {
  try {
    const department = await db.getDepartmentById(req.params.id);
    if (!department) return res.status(404).json({ error: 'Department not found' });
    res.json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createDepartment(req, res) {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    const department = await db.createDepartment({ name });
    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateDepartment(req, res) {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    const department = await db.updateDepartment(req.params.id, { name });
    if (!department) return res.status(404).json({ error: 'Department not found' });
    res.json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteDepartment(req, res) {
  try {
    const department = await db.deleteDepartment(req.params.id);
    if (!department) return res.status(404).json({ error: 'Department not found' });
    res.json({ message: 'Department deleted', department });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment };
