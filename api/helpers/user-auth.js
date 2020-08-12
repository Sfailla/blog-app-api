const { compare, hash } = require('bcryptjs');
const { sign, verify } = require('jsonwebtoken');

const comparePasswordBcrypt = async (password, userPassword) => {
	const isValidPassword = await compare(password, userPassword);

	return { isValidPassword };
};

/**
 * =========================
 * ==  PUBLIC FUNCTIONS   ==
 * =========================
 */

const hashPasswordBcrypt = async (password, salt = 10) => {
	return await hash(password, salt);
};

const verifyAuthToken = token => {
	return verify(token, process.env.JWT_SECRET);
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

const generateAuthToken = user => {
	const exp =
		Math.floor(Date.now() / 1000) + 60 * process.env.JWT_EXPIRES;
	const userId = user._id;
	const access = 'auth';
	const role = user.role;
	const username = user.username;
	const token = sign(
		{
			userId,
			username,
			role,
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
	verifyAuthToken,
	verifyPasswordReturnToken
};
