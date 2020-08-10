// this has to go to another file where we pull in all dependencies
const UserModel = require('../models/user/user');
const AuthService = require('../services/users');
const AuthController = require('../controllers/authController');

const authService = new AuthService(UserModel);
const authController = new AuthController(authService);

module.exports = {};
