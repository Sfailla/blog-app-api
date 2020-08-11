const { Router } = require('express');

const {
	authController
} = require('../services/user-auth/export-user-service');

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
