const { compare, hash } = require('bcryptjs');
const { sign, verify } = require('jsonwebtoken');

/**
 * ===============================
 * ==  PUBLIC HELPER FUNCTIONS  ==
 * ===============================
 */

const basicUserDetails = user => {
	const { id, role, username, email, createdAt } = user;
	return { id, role, username, email, createdAt };
};

const comparePasswordBcrypt = async (password, userPassword) => {
	return await compare(password, userPassword);
};

const hashPasswordBcrypt = async (password, salt = 10) => {
	return await hash(password, salt);
};

const verifyAuthToken = token => {
	return verify(token, process.env.JWT_SECRET);
};

const generateAuthToken = user => {
	const credentials = {
		user_id: user.id,
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
	comparePasswordBcrypt,
	basicUserDetails
};
