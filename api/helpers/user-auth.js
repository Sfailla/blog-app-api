const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const comparePasswordBcrypt = async (password, userPassword) => {
	const isValidPassword = await bcrypt.compare(
		password,
		userPassword
	);

	return { isValidPassword };
};

/**
 * =========================
 * ==  PUBLIC FUNCTIONS   ==
 * =========================
 */

const hashPasswordBcrypt = async (password, salt = 10) => {
	return await bcrypt.hash(password, salt);
};

const verifyPasswordReturnToken = async (password, user) => {
	const { isValidPassword } = await comparePasswordBcrypt(
		password,
		user.password
	);

	if (!isValidPassword) {
		// errorHandler
		return 'sorry error verifying password';
	}

	return generateAuthToken(user._id);
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
