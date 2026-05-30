const { Router } = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const config = require('../config')
const auth = require('../middleware/auth')

const router = Router()

const userProxy = createProxyMiddleware({
  target: config.services.userService,
  changeOrigin: true,
  on: {
    error: (err, req, res) => {
      console.error('User Service proxy error:', err.message)
      res.status(503).json({
        status: 'error',
        message: 'User Service unavailable'
      })
    }
  }
})

// Public routes — makhssarsh authentication
router.post('/register', userProxy)
router.post('/login', userProxy)

// Protected routes — mhtajin token
router.get('/', auth, userProxy)
router.get('/:id', auth, userProxy)
router.put('/:id', auth, userProxy)
router.delete('/:id', auth, userProxy)

module.exports = router