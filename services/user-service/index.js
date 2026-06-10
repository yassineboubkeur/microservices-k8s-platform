const app = require('./src/app')
const config = require('./src/config')

const server = app.listen(config.port, () => {
  console.log(`User Service running on port ${config.port}`)
})

process.on('SIGTERM', () => server.close(() => process.exit(0)))
process.on('SIGINT', () => server.close(() => process.exit(0)))