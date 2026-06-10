const jwt = require('jsonwebtoken')
const config = require('../config')

const auth = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Access token required' })
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ status: 'error', message: 'Invalid or expired token' })
  }
}

module.exports = auth