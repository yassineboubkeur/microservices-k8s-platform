const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const pool = require('./config/database')
const userRoutes = require('./routes/userRoutes')

const app = express()

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', service: 'user-service', db: 'connected' })
  } catch (err) {
    res.status(503).json({ status: 'error', db: err.message })
  }
})

app.get('/metrics', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() })
})


app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use('/users', userRoutes)

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: `Route ${req.method} ${req.url} not found` })
})

module.exports = app