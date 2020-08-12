const { verifyAuthToken } = require('../../helpers/user-auth');

const authenticate = async (req, res, next) => {
	const token = req.header('x-auth') || req.headers['authorization'];

	const response = verifyAuthToken(token);
	console.log(response);
	next();
};

module.exports = authenticate;
