const express = require('express')
const helmet = require('helmet')
const config = require('./config')
const logger = require('./middleware/logger')
const rateLimiter = require('./middleware/rateLimiter')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')

const app = express()

// Security headers
app.use(helmet())

app.use(rateLimiter)

// Logging
app.use(logger)

// Parse JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check — mkhsssh auth aw rate limit
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway', timestamp: new Date().toISOString() })
})

// Metrics endpoint — Prometheus ghadi yscrape hna
app.get('/metrics', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), memory: process.memoryUsage() })
})

// Routes
app.use('/api/users', userRoutes)
app.use('/api', productRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.url} not found`
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message)
  res.status(500).json({
    status: 'error',
    message: config.nodeEnv === 'production'
      ? 'Internal server error'
      : err.message
  })
})

module.exports = app