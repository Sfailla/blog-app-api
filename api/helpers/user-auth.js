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

const checkUserPassword = async (user, password) => {
	const isValidPassword = await comparePasswordBcrypt(
		password,
		user.password
	);

	if (!isValidPassword) {
		return {
			error: buildErrorObject(
				400,
				'user password does not match our records'
			)
		};
	}

	return { isValidPassword };
};

const hashPasswordBcrypt = async (password, salt = 10) => {
	return await hash(password, salt);
};

const verifyAuthToken = token => {
	return verify(token, process.env.JWT_SECRET);
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
	comparePasswordBcrypt
};
