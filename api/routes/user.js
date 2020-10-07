const UserDatabaseService = require('../services/user');
const AuthController = require('../controllers/user');
const { Router } = require('express');
const { authenticateJWT, requiredRole } = require('../middleware/index');
const UserModel = require('../models/user');
const AuthTokenModel = require('../models/authToken');
const ProfileModel = require('../models/profile');
const cron = require('node-cron');

const authService = new UserDatabaseService(UserModel, AuthTokenModel, ProfileModel);
const authController = new AuthController(authService, cron);

const {
	loginUser,
	logoutUser,
	registerUser,
	getAllUsers,
	getCurrentUser,
	deleteUser,
	refreshTokens,
	revokeToken
} = authController;

const router = Router();

/**
 * =================
 * == USER ROUTES ==
 * =================
 */

// login user
router.post('/login', loginUser);

// logout user
router.post('/logout', logoutUser);

// create user
router.post('/register', registerUser);

// refresh token
router.get('/refresh-tokens', refreshTokens);

// revoke token
router.put(
	'/revoke-token/:token',
	authenticateJWT,
	requiredRole('admin'),
	revokeToken
);

/**
 * =======================
 * == ADMIN ONLY ROUTES ==
 * =======================
 */

// get all users
router.get('/', authenticateJWT, requiredRole('admin'), getAllUsers);

// get specific user
router.get('/user/:id', authenticateJWT, requiredRole('admin'), getCurrentUser);

// delete user admin route
router.delete('/user/:id', authenticateJWT, deleteUser);

module.exports = router;
