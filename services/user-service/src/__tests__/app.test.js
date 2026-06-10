const request = require('supertest')
const app = require('../app')

describe('User Service', () => {
  test('GET /health returns 200 or 503', async () => {
    const res = await request(app).get('/health')
    expect([200, 503]).toContain(res.status)
    expect(res.body.service).toBe('user-service')
  })

  test('GET /metrics returns 200', async () => {
    const res = await request(app).get('/metrics')
    expect(res.status).toBe(200)
  })

  test('POST /users/register without body returns 400', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({})
    expect(res.status).toBe(400)
  })

  test('POST /users/login without body returns 400', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({})
    expect(res.status).toBe(400)
  })
})