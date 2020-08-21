const { verifyAuthToken } = require('../../helpers/user-auth');
const { UserServiceError } = require('../utils/errors');

const authenticateJWT = (req, res, next) => {
	const token = req.header('x-auth-token');
	console.log(token);

	if (token) {
		const user = verifyAuthToken(token);

		req.user = user;
		req.token = token;

		next();
	} else {
		const errMsg = 'must provide valid token';
		const err = new UserServiceError(409, errMsg);
		next(err);
	}
};

module.exports = authenticateJWT;
