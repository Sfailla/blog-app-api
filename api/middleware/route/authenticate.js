const { verifyAuthToken } = require('../../helpers/user-auth');
const { buildErrorObject } = require('../utils/http-error');

const authenticateJWT = (req, res, next) => {
	const token = req.header('x-auth-token');

	if (token) {
		const user = verifyAuthToken(token);

		req.user = user;
		req.token = token;

		next();
	} else {
		const error = buildErrorObject(409, 'must provide valid token');
		next(error);
	}
};

module.exports = authenticateJWT;
