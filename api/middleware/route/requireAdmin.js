const UserServiceError = require('../utils/errors');

const checkUserPermissions = (user, next) => {
	const { id, role, requiredRole } = user;

	// check user id in database
	const errMsg = 'this requires admin level authorization';
	const err = new Error(errMsg);

	return role === requiredRole ? next() : err;
};

const requireAdmin = requiredRole => (req, res, next) => {
	try {
		const { user_id, user_role } = req.user;
		const userData = {
			id: user_id,
			role: user_role,
			requiredRole
		};

		checkUserPermissions(userData, next);
	} catch (error) {
		console.log(error);
		throw new UserServiceError(error.message);
	}
};

module.exports = requireAdmin;
