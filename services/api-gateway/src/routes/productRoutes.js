const { Router } = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const config = require('../config')

const router = Router()

const productProxy = createProxyMiddleware({
  target: config.services.productService,
  changeOrigin: true,
  on: {
    error: (err, req, res) => {
      console.error('Product Service proxy error:', err.message)
      res.status(503).json({
        status: 'error',
        message: 'Product Service unavailable'
      })
    }
  }
})

// Products
router.get('/products', productProxy)
router.get('/products/:id', productProxy)
router.post('/products', productProxy)
router.put('/products/:id', productProxy)
router.delete('/products/:id', productProxy)

// Orders
router.get('/orders', productProxy)
router.get('/orders/:id', productProxy)
router.post('/orders', productProxy)
router.put('/orders/:id', productProxy)

module.exports = router