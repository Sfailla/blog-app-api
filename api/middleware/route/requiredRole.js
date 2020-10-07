const checkUserPermissions = require('../utils/checkPermissions');
const { ValidationError } = require('../utils/errors');

const requiredRole = userRole => async (req, res, next) => {
	try {
		if (!userRole) {
			const errMsg = 'must provide authorization role';
			throw new ValidationError(422, errMsg);
		}

		const userData = {
			id: req.user.id,
			role: req.user.role,
			userRole
		};

		await checkUserPermissions(userData, ValidationError, next);
	} catch (error) {
		return next(error);
	}
};

module.exports = requiredRole;
