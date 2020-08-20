const UserModel = require('../models/user/user');
const UserDatabaseService = require('../services/user-auth-service');
const AuthController = require('../controllers/user-auth');
const { Router } = require('express');
const { makeMongooseConnection } = require('../config/index');
const { UserServiceError } = require('../middleware/utils/errors');
const {
	authenticateJWT,
	requireAdmin
} = require('../middleware/index');

makeMongooseConnection();

const authService = new UserDatabaseService(UserModel);
const authController = new AuthController(
	authService,
	UserServiceError
);

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
	requireAdmin('user'),
	authController.getAllUsers
);

// get specific user
router.get(
	'/user/:id',
	authenticateJWT,
	requireAdmin('user'),
	authController.getCurrentUser
);

// TODO: add delete user admin route

module.exports = router;
