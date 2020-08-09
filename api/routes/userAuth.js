const { Router } = require('express');
const AuthService = require('../controllers/userAuth');

const router = Router();
const authController = new AuthService();

/**
 * =============================
 * 	USER AUTH ROUTES
 * =============================
 */
// get all users
router.get('/users', authController.getUser);
// create users
router.post('/users', authController.createUser);

module.exports = router;
