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
		createdAt: user.createdAt
	};
};

const makeAuthUser = user => {
	const { id, username, email, verification, role } = user;
	return { id, username, email, verification, role };
};

const makeUserProfile = async (profile, user) => {
	return {
		id: profile._id,
		username: profile.username,
		name: profile.name,
		bio: profile.bio,
		image: profile.image,
		favorites: profile.favorites,
		following: profile.following,
		isFollowing: user ? await profile.isFollowing(user._id) : false
	};
};

const comparePasswordBcrypt = async (password, userPassword) => {
	return await compare(password, userPassword);
};

const hashPasswordBcrypt = async (password, salt = 10) => {
	return await hash(password, salt);
};

const verifyAuthToken = token => {
	return verify(token, process.env.ACCESS_TOKEN_SECRET);
};

const verifyRefreshToken = token => {
	return verify(token, process.env.REFRESH_TOKEN_SECRET);
};

const random_uuid = encryptionLength => {
	return crypto.randomBytes(encryptionLength).toString('hex');
};

const signAndSetCookie = (res, name, value) => {
	let options = {
		maxAge: 7 * 24 * 60 * 60 * 1000, // would expire after 1 week
		httpOnly: true, // The cookie only accessible by the web server
		signed: true // Indicates if the cookie should be signed
		// secure: true // request must come from webserver
	};

	res.cookie(name, value, options);
};

const findAndRetrieveCookie = (req, value) => {
	return req.signedCookies[value];
};

const generateAuthToken = user => {
	const credentials = {
		userId: user.id,
		username: user.username
	};
	const exp = { expiresIn: process.env.ACCESS_TOKEN_EXP };
	return sign(credentials, process.env.ACCESS_TOKEN_SECRET, exp);
};

const generateRefreshToken = user => {
	const credentials = {
		userId: user.id,
		username: user.username,
		verification: user.verification
	};
	const exp = { expiresIn: process.env.REFRESH_TOKEN_EXP };
	return sign(credentials, process.env.REFRESH_TOKEN_SECRET, exp);
};

module.exports = {
	signAndSetCookie,
	findAndRetrieveCookie,
	hashPasswordBcrypt,
	generateAuthToken,
	generateRefreshToken,
	verifyAuthToken,
	verifyRefreshToken,
	comparePasswordBcrypt,
	random_uuid,
	makeUserObj,
	makeAuthUser,
	makeUserProfile
};
