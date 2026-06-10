const request = require('supertest')
const app = require('../app')

describe('API Gateway', () => {
  test('GET /health returns 200', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(res.body.service).toBe('api-gateway')
  })

  test('GET /metrics returns 200', async () => {
    const res = await request(app).get('/metrics')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })

  test('GET /unknown returns 404', async () => {
    const res = await request(app).get('/unknown')
    expect(res.status).toBe(404)
    expect(res.body.status).toBe('error')
  })

  test('GET /api/users without token returns 401', async () => {
    const res = await request(app).get('/api/users')
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Access token required')
  })
})