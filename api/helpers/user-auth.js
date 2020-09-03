const { compare, hash } = require('bcryptjs');
const { sign, verify } = require('jsonwebtoken');

/**
 * ===============================
 * ==  PUBLIC HELPER FUNCTIONS  ==
 * ===============================
 */

const copyUserObj = user => {
	return {
		id: user._id,
		username: user.username,
		email: user.email,
		role: user.role,
		name: user.name,
		bio: user.bio,
		image: user.image,
		favorites: user.favorites,
		following: user.following,
		createdAt: user.createdAt
	};
};

const makeAuthUser = user => {
	const { id, username, email, name, bio, image } = user;
	return { id, username, email, name, bio, image };
};

const makeUserProfile = async (user, follower) => {
	return {
		id: user.id,
		username: user.username,
		name: user.name,
		bio: user.bio,
		image: user.image,
		isFollowing: follower
			? await user.isFollowing(follower._id)
			: false
	};
};

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
	copyUserObj,
	makeAuthUser,
	makeUserProfile
};
