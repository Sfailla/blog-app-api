const {
	verifyAuthToken,
	copyUserDetails
} = require('../../helpers/user-auth');
const { ValidationError } = require('../utils/errors');
const UserModel = require('../../models/user');

const authenticateJWT = async (req, res, next) => {
	try {
		const token = req.header('x-auth-token');
		const verifiedUser = verifyAuthToken(token);
		const user = await UserModel.findById(verifiedUser.id);

		if (!user) {
			const errMsg = 'error fetching user';
			throw new ValidationError(400, errMsg);
		}

		req.user = copyUserDetails(user);
		req.token = token;

		return next();
	} catch (error) {
		next(error);
	}
};

module.exports = authenticateJWT;
