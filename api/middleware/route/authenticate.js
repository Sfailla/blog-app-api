const { verifyAuthToken } = require('../../helpers/user-auth');
const { ValidationError } = require('../utils/errors');

const authenticateJWT = (req, res, next) => {
	const token = req.header('x-auth-token');

	if (token) {
		const user = verifyAuthToken(token);

		req.user = user;
		req.token = token;

		next();
	} else {
		const errMsg = 'must provide valid token';
		const err = new ValidationError(409, errMsg);
		next(err);
	}
};

module.exports = authenticateJWT;
