const { compare, hash } = require('bcryptjs');
const { sign, verify } = require('jsonwebtoken');
const crypto = require('crypto');

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

const randomTokenString = () => {
	return crypto.randomBytes(40).toString('hex');
};

const generateAuthToken = user => {
	const credentials = {
		id: user.id,
		role: user.role,
		username: user.username,
		access: 'auth-token'
	};
	const expiration = {
		expiresIn: process.env.ACCESS_TOKEN_EXPIRATION
	};
	return sign(credentials, process.env.ACCESS_TOKEN_SECRET, expiration);
};

const generateRefreshToken = user => {
	return {
		user: user.id,
		token: randomTokenString(),
		expires: new Date(Date.now() + 10 * 60 * 1000)
	};
};

module.exports = {
	hashPasswordBcrypt,
	generateAuthToken,
	generateRefreshToken,
	verifyAuthToken,
	comparePasswordBcrypt,
	makeUserObj,
	makeAuthUser,
	makeUserProfile
};
