require('dotenv').config()

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  services: {
    userService: process.env.USER_SERVICE_URL || 'http://user-service:4000',
    productService: process.env.PRODUCT_SERVICE_URL || 'http://product-service:5000'
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX || 100
  }
}