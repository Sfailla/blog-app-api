const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateAuthToken = userId => {
	const exp =
		Math.floor(Date.now() / 1000) + 60 * process.env.JWT_EXPIRES;
	const access = 'auth';
	const token = jwt.sign(
		{
			userId,
			access,
			exp
		},
		process.env.JWT_SECRET
	);

	return token;
};

module.exports = {
	generateAuthToken
};
