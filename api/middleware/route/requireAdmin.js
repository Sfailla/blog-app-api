const {
	buildErrorObject,
	handleError
} = require('../utils/http-error');

const checkUserPermissions = async (user, next) => {
	return new Promise((resolve, reject) => {
		const { id, role, requiredRole } = user;

		if (requiredRole && role === requiredRole) {
			return resolve(next());
		}

		const error = buildErrorObject(
			401,
			'admin level authorization is required'
		);
		return reject(error);
	});
};

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
		handleError(res, error);
	}
};

module.exports = requireAdmin;
