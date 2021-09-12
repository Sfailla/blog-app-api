const UserDatabaseService = require('../services/user')
const AuthController = require('../controllers/user')
const { Router } = require('express')
const { authenticateJWT, requiredRole } = require('../middleware/index')
const UserModel = require('../models/user')
const AuthTokenModel = require('../models/authToken')
const ProfileModel = require('../models/profile')

const authService = new UserDatabaseService(UserModel, AuthTokenModel, ProfileModel)
const authController = new AuthController(authService)

const {
  loginUser,
  logoutUser,
  registerUser,
  getAllUsers,
  getUserById,
  deleteUser,
  refreshTokens,
  revokeToken
} = authController

const router = Router()

/**
 * =================
 * == USER ROUTES ==
 * =================
 */

// create user
router.post('/register', registerUser)

// login user
router.post('/login', loginUser)

// logout user
router.get('/logout', requiredRole('user'), logoutUser)

// refresh token
router.get('/refresh-tokens', requiredRole('user'), refreshTokens)

/**
 * =======================
 * == ADMIN ONLY ROUTES ==
 * =======================
 */

// get all users
router.get('/admin/get-users', authenticateJWT, requiredRole('admin'), getAllUsers)

// get specific user
router.get('/admin/user/:id', authenticateJWT, requiredRole('admin'), getUserById)

// revoke token
router.put('/admin/revoke-token/:token', requiredRole('admin'), revokeToken)

// delete user
router.delete('/admin/user/:id', authenticateJWT, requiredRole('admin'), deleteUser)

module.exports = router
