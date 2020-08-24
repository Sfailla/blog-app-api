const checkUserPermissions = require('../utils/checkPermissions');
const { ValidationError } = require('../utils/errors');

const requireAdmin = requiredRole => async (req, res, next) => {
	try {
		if (!requiredRole) {
			const errMsg = 'must provide authorization role';
			return new ValidationError(422, errMsg);
		}

		const { id, role } = req.user;
		const userData = {
			id,
			role,
			requiredRole
		};

		await checkUserPermissions(userData, next);
	} catch (error) {
		next(error);
	}
};

module.exports = requireAdmin;
