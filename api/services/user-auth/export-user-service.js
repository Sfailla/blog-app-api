// this has to go to another file where we pull in all dependencies
const UserModel = require('../../models/user/user');
const UserDatabaseService = require('./user-auth-service');
const AuthController = require('../../controllers/user-auth');
const { makeMongooseConnection } = require('../../config/index');

makeMongooseConnection();

const authService = new UserDatabaseService(UserModel);
const authController = new AuthController(authService);

module.exports = { authController };
