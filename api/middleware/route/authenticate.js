const { verifyToken, makeUserObj } = require('../../helpers/user-auth');
const { ValidationError } = require('../utils/errors');
const UserModel = require('../../models/user');

const authenticateJWT = async (req, res, next) => {
	try {
		const token = req.header('x-auth-token');
		const verifiedUser = await verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
		const user = await UserModel.findById(verifiedUser.userId);

		if (!verifiedUser || !user) {
			const errMsg = 'error authenticating user';
			throw new ValidationError(400, errMsg);
		}

		req.user = makeUserObj(user);

		return next();
	} catch (error) {
		next(error);
	}
};

module.exports = authenticateJWT;
