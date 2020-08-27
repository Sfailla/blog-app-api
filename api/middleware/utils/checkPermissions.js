const checkUserPermissions = async (user, validationError, next) => {
	return new Promise((resolve, reject) => {
		const { role, requiredRole } = user;

		if (role === requiredRole) {
			return resolve(next());
		}
		const errMsg = 'admin level authorization is required';
		return reject(new validationError(401, errMsg));
	});
};

module.exports = checkUserPermissions;
