const authenticateJWT = require('./route/authenticate');
const requiredRole = require('./route/requiredRole');

// export our middlewares to prevent multiple imports
module.exports = {
	authenticateJWT,
	requiredRole
};
