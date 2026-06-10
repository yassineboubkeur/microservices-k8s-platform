const { Router } = require('express')
const { getAllUsers, getUserById, register, updateUser, deleteUser } = require('../controllers/userController')
const { login } = require('../controllers/authController')
const auth = require('../middleware/auth')

const router = Router()

// Public
router.post('/register', register)
router.post('/login', login)


router.get('/', auth, getAllUsers)
router.get('/:id', auth, getUserById)
router.put('/:id', auth, updateUser)
router.delete('/:id', auth, deleteUser)

module.exports = router