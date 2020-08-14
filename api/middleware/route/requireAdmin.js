const { checkUserPermissions } = require('../../helpers/user-auth');

const requireAdmin = requiredRole => async (req, res, next) => {
	const { user_id, user_role } = req.user;

	const userData = {
		id: user_id,
		role: user_role,
		requiredRole
	};

	checkUserPermissions(userData, next);
};

module.exports = requireAdmin;
