const { UserServiceError } = require('./errors');

const checkUserPermissions = async (user, next) => {
	return new Promise((resolve, reject) => {
		const { role, requiredRole } = user;

		if (requiredRole && role === requiredRole) {
			return resolve(next());
		}

		const errMsg = 'admin level authorization is required';
		const err = new UserServiceError(401, errMsg);
		return reject(err);
	});
};

module.exports = checkUserPermissions;
