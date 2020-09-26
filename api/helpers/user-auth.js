const { compare, hash } = require('bcryptjs');
const { sign, verify } = require('jsonwebtoken');

/**
 * ===============================
 * ==  PUBLIC HELPER FUNCTIONS  ==
 * ===============================
 */

const makeUserObj = user => {
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

const makeUserProfile = async (follower, user) => {
	return {
		id: follower._id,
		username: follower.username,
		name: follower.name,
		bio: follower.bio,
		image: follower.image,
		isFollowing: user ? await user.isFollowing(follower._id) : false
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
		exp: Math.floor(Date.now() / 1000) + 60 * process.env.JWT_EXPIRES_IN_MINUTES
	};

	return sign(credentials, process.env.JWT_SECRET);
};

module.exports = {
	hashPasswordBcrypt,
	generateAuthToken,
	verifyAuthToken,
	comparePasswordBcrypt,
	makeUserObj,
	makeAuthUser,
	makeUserProfile
};
