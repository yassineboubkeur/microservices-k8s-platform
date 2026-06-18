const express = require('express')
const helmet = require('helmet')
const config = require('./config')
const logger = require('./middleware/logger')
const rateLimiter = require('./middleware/rateLimiter')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const promClient = require('prom-client')

const app = express()

// Security headers
app.use(helmet())

app.use(rateLimiter)

// Logging
app.use(logger)

// Parse JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

promClient.collectDefaultMetrics()


// Health check — mkhsssh auth aw rate limit
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'api-gateway',
    version: process.env.CANARY === 'true' ? 'canary' : 'stable',
    timestamp: new Date().toISOString()
  })
})

// Metrics endpoint — Prometheus ghadi yscrape hna
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType)
  res.send(await promClient.register.metrics())
})
app.get('/version', (req, res) => {
  res.json({ version: '1.1.0', service: 'api-gateway' })
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