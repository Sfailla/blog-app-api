const authenticateJWT = require('./route/authenticate');
const requireAdmin = require('./route/requireAdmin');

// export our middlewares to prevent multiple imports
module.exports = {
	authenticateJWT,
	requireAdmin
};
