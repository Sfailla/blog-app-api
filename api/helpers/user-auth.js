const { compare, hash } = require('bcryptjs');
const { sign, verify } = require('jsonwebtoken');
const { networkInterfaces } = require('os');
const crypto = require('crypto');

/**
 * ===============================
 * ==  	  HELPER FUNCTIONS    	==
 * ===============================
 */

const makeAuthUser = user => {
	const { id, username, email, verification, ipAddress, role } = user;
	return { id, username, email, verification, ipAddress, role };
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

const getIpAddress = () => {
	const nets = networkInterfaces();
	const results = Object.create(null);

	for (const name of Object.keys(nets)) {
		for (const net of nets[name]) {
			// skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
			if (net.family === 'IPv4' && !net.internal) {
				if (!results[name]) {
					results[name] = [];
				}
				results[name].push(net.address);
			}
		}
	}
	return results['Wi-Fi'][0];
};

const comparePasswordBcrypt = async (password, userPassword) => {
	return await compare(password, userPassword);
};

const hashPasswordBcrypt = async (password, salt = 10) => {
	return await hash(password, salt);
};

const verifyToken = async (token, secret) => {
	return verify(token, secret);
};

const verifyRefreshTokenAndUser = (token, user) => {
	const verifiedToken = verifyToken(token, process.env.REFRESH_TOKEN_SECRET);
	const verifiedUser = user.verification === verifiedToken.verification;
	if (verifiedToken && verifiedUser) {
		return { verifiedToken, verifiedUser };
	} else {
		return { errorMessage: 'error verifying user and/or token' };
	}
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
		verification: user.verification,
		ipAddress: user.ipAddress
	};
	const exp = { expiresIn: process.env.REFRESH_TOKEN_EXP };
	return sign(credentials, process.env.REFRESH_TOKEN_SECRET, exp);
};

const generateTokens = user => {
	const accessToken = generateAuthToken(user);
	const refreshToken = generateRefreshToken(user);
	return { token: accessToken, refreshToken };
};

const refreshTokenJob = () => {
	// const tokens = await this.tokenModel.findOne({ token: getRefreshToken });
	// console.log(tokens);
	// const maxTokens = tokens => {
	// 	return tokens.slice(0, 4).map(token => token);
	// };
	// const sortedTokens = getTokens.sort((a, b) => {
	// 	return b.createdAt - a.createdAt;
	// });
	// const sortedTokenLength = sortedTokens.length;
	// const tokens = sortedTokenLength > 5 ? maxTokens(sortedTokens) : sortedTokens;
	// console.log(tokens);
	// return { token, refreshToken, user };
};

module.exports = {
	signAndSetCookie,
	findAndRetrieveCookie,
	hashPasswordBcrypt,
	generateTokens,
	verifyToken,
	verifyRefreshTokenAndUser,
	comparePasswordBcrypt,
	random_uuid,
	makeAuthUser,
	makeUserProfile,
	getIpAddress
};
