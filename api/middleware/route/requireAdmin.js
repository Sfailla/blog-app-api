const checkUserPermissions = require('../utils/checkPermissions');
const { UserServiceError } = require('../utils/errors');

const requireAdmin = requiredRole => async (req, res, next) => {
	try {
		if (!requiredRole) {
			const errMsg = 'must provide authorization role';
			throw new UserServiceError(422, errMsg);
		}

		const { user_id, user_role } = req.user;
		const userData = {
			id: user_id,
			role: user_role,
			requiredRole
		};

		await checkUserPermissions(userData, next);
	} catch (error) {
		next(error);
	}
};

module.exports = requireAdmin;
