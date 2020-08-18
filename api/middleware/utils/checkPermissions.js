const { buildErrorObject } = require('./http-error');

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

module.exports = checkUserPermissions;
