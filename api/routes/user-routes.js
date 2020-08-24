const UserModel = require('../models/user');
const UserDatabaseService = require('../services/user-auth-service');
const AuthController = require('../controllers/user-auth');
const { Router } = require('express');
const {
	authenticateJWT,
	requireAdmin
} = require('../middleware/index');

const authService = new UserDatabaseService(UserModel);
const authController = new AuthController(authService);

const router = Router();

/**
 * =================
 * == USER ROUTES ==
 * =================
 */

// login user
router.post('/login', authController.loginUser);

// logout user
router.get('/logout', authController.logoutUser);

// create user
router.post('/register', authController.registerUser);

/**
 * =======================
 * == ADMIN ONLY ROUTES ==
 * =======================
 */

// get all users
router.get(
	'/',
	authenticateJWT,
	requireAdmin('admin'),
	authController.getAllUsers
);

// get specific user
router.get(
	'/user/:id',
	authenticateJWT,
	requireAdmin('admin'),
	authController.getCurrentUser
);

// TODO: add delete user admin route

module.exports = router;
