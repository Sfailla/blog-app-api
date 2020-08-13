const authenticateJWT = require('./route-middleware/authenticate');
const requireAdmin = require('./route-middleware/requireAdmin');

// export our middlewares to prevent multiple imports
module.exports = {
	authenticateJWT,
	requireAdmin
};
