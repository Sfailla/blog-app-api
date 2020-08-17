const checkUserPermissions = require('../utils/checkPermissions');
const { handleError } = require('../utils/http-error');

const requireAdmin = requiredRole => async (req, res, next) => {
	try {
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
