const checkUserPermissions = require('../utils/checkPermissions');
const { buildErrorObject } = require('../utils/http-error');

const requireAdmin = requiredRole => async (req, res, next) => {
	if (!requiredRole)
		next(buildErrorObject(422, 'must provide authorization role'));
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
