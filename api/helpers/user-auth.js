const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const hashPasswordBcrypt = async (password, salt = 10) => {
	return await bcrypt.hash(password, salt);
};

const verifyPasswordReturnToken = async (password, user) => {
	const checkPassword = await bcrypt.compare(password, user.password);

	if (!checkPassword) {
		// respond with errorHandler
	}

	const token = generateAuthToken(user._id);
	return token;
};

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
	hashPasswordBcrypt,
	generateAuthToken,
	verifyPasswordReturnToken
};
