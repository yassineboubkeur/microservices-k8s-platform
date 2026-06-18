const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const pool = require('./config/database')
const userRoutes = require('./routes/userRoutes')
const promClient = require('prom-client')

const app = express()

promClient.collectDefaultMetrics()

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', service: 'user-service', db: 'connected' })
  } catch (err) {
     res.status(503).json({ status: 'error', service: 'user-service', db: 'disconnected' })
  }
})


app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType)
  res.send(await promClient.register.metrics())
})


app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use('/users', userRoutes)

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: `Route ${req.method} ${req.url} not found` })
})

module.exports = app