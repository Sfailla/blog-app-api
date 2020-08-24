const { ValidationError } = require('./errors');

const checkUserPermissions = async (user, next) => {
	return new Promise((resolve, reject) => {
		const { role, requiredRole } = user;

		if (role === requiredRole) {
			return resolve(next());
		}

		const errMsg = 'admin level authorization is required';
		const err = new ValidationError(401, errMsg);
		return reject(err);
	});
};

module.exports = checkUserPermissions;
