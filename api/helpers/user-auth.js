const { compare, hash } = require('bcryptjs');
const { sign, verify } = require('jsonwebtoken');

/**
 * ===============================
 * ==  PUBLIC HELPER FUNCTIONS  ==
 * ===============================
 */

const copyUserDetails = user => {
	const { id, username, email, role, name, bio, image, favorites, following, createdAt } = user;
	return { id, username, email, role, name, bio, image, favorites, following, createdAt };
};

const makeUserProfile = user => {
	const {id, username, name, bio, image } = user;
	return {id, username, name, bio, image};
}

const comparePasswordBcrypt = async (password, userPassword) => {
	return await compare(password, userPassword);
};

const hashPasswordBcrypt = async (password, salt = 10) => {
	return await hash(password, salt);
};

const verifyAuthToken = async token => {
	return await verify(token, process.env.JWT_SECRET);
};

const generateAuthToken = user => {
	const credentials = {
		id: user.id,
		role: user.role,
		username: user.username,
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
	copyUserDetails,
	makeUserProfile
};
