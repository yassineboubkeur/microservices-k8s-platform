const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'api-gateway',
    timestamp: new Date().toISOString()
  })
})

app.get('/', (req, res) => {
  res.json({ message: 'API Gateway running' })
})

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`)
})