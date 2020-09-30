const UserModel = require('../models/user');
const AuthTokenModel = require('../models/authToken');
const UserDatabaseService = require('../services/user');
const AuthController = require('../controllers/user');
const { Router } = require('express');
const { authenticateJWT, requireAdmin } = require('../middleware/index');

const authService = new UserDatabaseService(UserModel, AuthTokenModel);
const authController = new AuthController(authService);

const {
	loginUser,
	logoutUser,
	registerUser,
	getAllUsers,
	getCurrentUser,
	deleteUser,
	refreshToken
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
router.get('/refresh-token', refreshToken);

/**
 * =======================
 * == ADMIN ONLY ROUTES ==
 * =======================
 */

// get all users
router.get('/', authenticateJWT, requireAdmin('admin'), getAllUsers);

// get specific user
router.get('/user/:id', authenticateJWT, requireAdmin('admin'), getCurrentUser);

// delete user admin route
router.delete('/user/:id', authenticateJWT, deleteUser);

module.exports = router;
