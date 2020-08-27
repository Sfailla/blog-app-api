const checkUserPermissions = require('../utils/checkPermissions');
const { ValidationError } = require('../utils/errors');

const requireAdmin = requiredRole => async (req, res, next) => {
	try {
		if (!requiredRole) {
			const errMsg = 'must provide authorization role';
			throw new ValidationError(422, errMsg);
		}

		const userData = {
			id: req.user._id,
			role: req.user.role,
			requiredRole
		};

		await checkUserPermissions(userData, ValidationError, next);
	} catch (error) {
		return next(error);
	}
};

module.exports = requireAdmin;
