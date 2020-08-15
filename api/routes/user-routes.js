const UserModel = require('../models/user/user');
const UserDatabaseService = require('../services/user-auth-service');
const AuthController = require('../controllers/user-auth');
const { Router } = require('express');
const { makeMongooseConnection } = require('../config/index');
const {
	authenticateJWT,
	requireAdmin
} = require('../middleware/index');

makeMongooseConnection();

const authService = new UserDatabaseService(UserModel);
const authController = new AuthController(authService);

const router = Router();

/**
 * =============================
 * 	USER AUTH ROUTES
 * =============================
 */

// get all users  @todo make admin-only-route
router.get(
	'/users',
	authenticateJWT,
	requireAdmin('user'),
	authController.getAllUsers
);

// get specific user
router.get('/users/:id', authController.getCurrentUser);

// login user
router.post('/users/login', authController.loginUser);

// create user
router.post('/users/register', authController.registerUser);

module.exports = router;
