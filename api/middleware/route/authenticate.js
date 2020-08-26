const {
	verifyAuthToken,
	copyUserDetails
} = require('../../helpers/user-auth');
const { ValidationError } = require('../utils/errors');
const UserModel = require('../../models/user');

const authenticateJWT = async (req, res, next) => {
	const token = req.header('x-auth-token');

	if (token) {
		const verifiedUser = verifyAuthToken(token);

		if (verifiedUser) {
			const user = await UserModel.findById(verifiedUser.id);
			req.user = copyUserDetails(user);
			req.token = token;

			next();
		} else {
			const errMsg = 'error fetching user for authentication';
			const err = new ValidationError(400, errMsg);
			next(err);
		}
	} else {
		const errMsg = `expected valid token but recieved => ${token}`;
		const err = new ValidationError(409, errMsg);
		next(err);
	}
};

module.exports = authenticateJWT;
