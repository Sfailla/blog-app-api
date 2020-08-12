const { compare, hash } = require('bcryptjs');
const { sign, verify } = require('jsonwebtoken');

const comparePasswordBcrypt = async (password, userPassword) => {
	return await compare(password, userPassword);
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
	const isValidPassword = await comparePasswordBcrypt(
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
	const credentials = {
		user_id: user._id,
		user_role: user.role,
		user_name: user.username,
		access: 'auth-token',
		exp: Math.floor(Date.now() / 1000) + 60 * process.env.JWT_EXPIRES
	};

	return sign(credentials, process.env.JWT_SECRET);
};

module.exports = {
	hashPasswordBcrypt,
	generateAuthToken,
	verifyAuthToken,
	verifyPasswordReturnToken
};
