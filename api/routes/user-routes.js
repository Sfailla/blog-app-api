const { Router } = require('express');
const UserModel = require('../models/user/user');
const UserDatabaseService = require('../services/user-auth-service');
const AuthController = require('../controllers/user-auth');
const { makeMongooseConnection } = require('../config/index');

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
router.get('/users', authController.getAllUsers);

// get specific user
router.get('/users/:id', authController.getCurrentUser);

// login user
router.post('/users/login', authController.loginUser);

// create users
router.post('/users/register', authController.registerUser);

module.exports = router;
