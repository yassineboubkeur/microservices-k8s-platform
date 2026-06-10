const pool = require('../config/database')
const bcrypt = require('bcryptjs')

// GET /users
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC'
    )
    res.json({ status: 'ok', data: result.rows })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

// GET /users/:id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' })
    }
    res.json({ status: 'ok', data: result.rows[0] })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

// POST /users/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'Name, email and password required' })
    }

    // Check duplicate email
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0) {
      return res.status(409).json({ status: 'error', message: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, hashedPassword]
    )

    res.status(201).json({ status: 'ok', data: result.rows[0] })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

// PUT /users/:id
const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email } = req.body

    if (!name && !email) {
      return res.status(400).json({ status: 'error', message: 'Name or email required' })
    }

    const result = await pool.query(
      'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), updated_at = NOW() WHERE id = $3 RETURNING id, name, email, updated_at',
      [name, email, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' })
    }

    res.json({ status: 'ok', data: result.rows[0] })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

// DELETE /users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' })
    }

    res.json({ status: 'ok', message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

module.exports = { getAllUsers, getUserById, register, updateUser, deleteUser }