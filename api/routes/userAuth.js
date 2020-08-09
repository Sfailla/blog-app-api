const { Router } = require('express');
const AuthService = require('../controllers/userRequest');

const router = Router();
const authController = new AuthService();

/**
 * =============================
 * 	USER AUTH ROUTES
 * =============================
 */
// get all users
router.get('/users', authController.getAllUsers);

// get specific user
router.get('/users/:id');

// create users
router.post('/users/register', authController.registerUser);

module.exports = router;
