const UserModel = require('../models/user');
const UserDatabaseService = require('../services/user-auth-service');
const AuthController = require('../controllers/user-auth');
const { Router } = require('express');
const { authenticateJWT, requireAdmin } = require('../middleware/index');

const authService = new UserDatabaseService(UserModel);
const authController = new AuthController(authService);

const {
	loginUser,
	logoutUser,
	registerUser,
	getAllUsers,
	getCurrentUser,
	deleteUser
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
