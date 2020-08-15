const { verifyAuthToken } = require('../../helpers/user-auth');
const { buildErrorObject } = require('../utils/errors');

const authenticateJWT = (req, res, next) => {
	const token = req.header('x-auth-token');

	if (token) {
		const user = verifyAuthToken(token);

		req.user = user;
		req.token = token;

		next();
	} else {
		const error = 'Invalid Token';
		buildErrorObject(409, error);
	}
};

module.exports = authenticateJWT;
