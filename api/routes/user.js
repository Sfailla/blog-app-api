const UserDatabaseService = require('../services/user');
const AuthController = require('../controllers/user');
const { Router } = require('express');
const { authenticateJWT, requiredRole } = require('../middleware/index');
const UserModel = require('../models/user');
const AuthTokenModel = require('../models/authToken');
const ProfileModel = require('../models/profile');

const authService = new UserDatabaseService(UserModel, AuthTokenModel, ProfileModel);
const authController = new AuthController(authService);

const {
	loginUser,
	logoutUser,
	registerUser,
	getAllUsers,
	getCurrentUser,
	deleteUser,
	refreshTokens,
	revokeToken
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
router.post('/logout/:token', requiredRole('user'), logoutUser);

// create user
router.post('/register', registerUser);

// refresh token
router.get('/refresh-tokens', requiredRole('user'), refreshTokens);


/**
 * =======================
 * == ADMIN ONLY ROUTES ==
 * =======================
 */

// get all users
router.get('/admin', authenticateJWT, requiredRole('admin'), getAllUsers);

// get specific user
router.get('/admin/user/:id', authenticateJWT, requiredRole('admin'), getCurrentUser);

// revoke token
router.put('/admin/revoke-token/:token', requiredRole('admin'), revokeToken);

// delete user admin route
router.delete('/admin/user/:id', authenticateJWT, requiredRole('admin'), deleteUser);

module.exports = router;
