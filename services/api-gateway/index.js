const app = require('./src/app')
const config = require('./src/config')

const server = app.listen(config.port, () => {
  console.log(`API Gateway running on port ${config.port}`)
  console.log(`Environment: ${config.nodeEnv}`)
})

process.on('SIGTERM', () => {
  server.close(() => process.exit(0))
})

process.on('SIGINT', () => {
  server.close(() => process.exit(0))
})