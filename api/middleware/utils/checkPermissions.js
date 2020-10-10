const checkUserPermissions = async (user, validationError, next) => {
	return new Promise((resolve, reject) => {
		const { role, userRole } = user;

		if (role === userRole || 'admin') {
			return resolve(next());
		}
		const errMsg = 'admin level authorization is required';
		return reject(new validationError(401, errMsg));
	});
};

module.exports = checkUserPermissions;
