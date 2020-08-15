const { handleError, buildErrorObject } = require('../utils/errors');

const checkUserPermissions = (user, next) => {
	const { id, role, requiredRole } = user;

	// check user id in database
	console.log(requiredRole);
	console.log(role);

	if (requiredRole && role === requiredRole) {
		next();
	} else {
		const error = buildErrorObject(
			401,
			'this requires admin level authorization'
		);
		next(error);
	}
};

const requireAdmin = requiredRole => async (req, res, next) => {
	if (requiredRole) {
		const { user_id, user_role } = req.user;
		const userData = {
			id: user_id,
			role: user_role,
			requiredRole
		};

		checkUserPermissions(userData, next);
	} else {
		const error = buildErrorObject(
			400,
			'must provide a required authentication role'
		);
		next(error);
	}
};

module.exports = requireAdmin;
