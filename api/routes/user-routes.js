const UserModel = require('../models/user/user');
const UserDatabaseService = require('../services/user-auth-service');
const AuthController = require('../controllers/user-auth');
const { Router } = require('express');
const { makeMongooseConnection } = require('../config/index');
const authenticate = require('../middleware/utils/authenticate');

makeMongooseConnection();

const authService = new UserDatabaseService(UserModel);
const authController = new AuthController(authService);

const router = Router();

/**
 * =============================
 * 	USER AUTH ROUTES
 * =============================
 */

// get all users
router.get('/users', authenticate, authController.getAllUsers);

// get specific user
router.get('/users/:id', authController.getCurrentUser);

// login user
router.post('/users/login', authController.loginUser);

// create user
router.post('/users/register', authController.registerUser);

module.exports = router;
