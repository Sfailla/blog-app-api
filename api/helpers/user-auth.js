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
	return await verify(token, process.env.ACCESS_TOKEN_SECRET);
};

const verifyRefreshToken = async token => {
	return await verify(token, process.env.REFRESH_TOKEN_SECRET);
};

const random_uuid = () => {
	return crypto.randomBytes(10).toString('hex');
};

const generateAuthToken = user => {
	const credentials = {
		id: user.id,
		username: user.username,
		access: 'auth-token'
	};
	const exp = { expiresIn: process.env.ACCESS_TOKEN_EXP };
	return sign(credentials, process.env.ACCESS_TOKEN_SECRET, exp);
};

const generateRefreshToken = user => {
	const credentials = {
		user: user.id,
		permission: random_uuid()
	};
	const exp = { expiresIn: process.env.REFRESH_TOKEN_EXP };
	return sign(credentials, process.env.REFRESH_TOKEN_SECRET, exp);
};

module.exports = {
	hashPasswordBcrypt,
	generateAuthToken,
	generateRefreshToken,
	verifyAuthToken,
	verifyRefreshToken,
	comparePasswordBcrypt,
	makeUserObj,
	makeAuthUser,
	makeUserProfile
};
