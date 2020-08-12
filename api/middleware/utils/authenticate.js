const { verifyAuthToken } = require('../../helpers/user-auth');

const authenticateJWT = async (req, res, next) => {
	const token =
		req.header('x-auth-token') || req.headers['authorization'];
	const user = verifyAuthToken(token);

	req.user = user;
	req.token = token;

	next();
};

module.exports = authenticateJWT;
