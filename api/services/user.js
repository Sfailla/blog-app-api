const { ValidationError } = require('../middleware/utils/errors');
const { isValidObjId } = require('../database/db/index');
const { trimRequest } = require('../helpers/validation');
const {
	generateTokens,
	signAndSetCookie,
	findAndRetrieveCookie,
	hashPasswordBcrypt,
	comparePasswordBcrypt,
	makeUserObj,
	makeAuthUser,
	random_uuid,
	verifyToken
} = require('../helpers/user-auth');

class UserDatabaseService {
	constructor(userModel, tokenModel, profileModel) {
		this.userModel = userModel;
		this.tokenModel = tokenModel;
		this.profileModel = profileModel;
	}

	createUser = async userFields => {
		const trimmedRequest = trimRequest(userFields);
		const hashedPassword = await hashPasswordBcrypt(trimmedRequest.password);
		const getUser = await this.userModel.create({
			...trimmedRequest,
			password: hashedPassword,
			verification: random_uuid(8)
		});
		if (!getUser) {
			const err = new ValidationError(400, 'error creating user');
			return { err };
		}
		return { user: makeAuthUser(getUser) };
	};

	createCookie = async (res, token) => signAndSetCookie(res, 'refreshToken', token);

	readCookie = async req => await findAndRetrieveCookie(req, 'refreshToken');

	createAndSaveTokens = async user => {
		const { token, refreshToken } = generateTokens(user);
		await this.tokenModel.create({
			user: user.id,
			token: refreshToken
		});
		return { token, refreshToken };
	};

	findAndRefreshTokens = async (req, res) => {
		const getRefreshToken = await this.readCookie(req);
		const verifiedToken = await verifyToken(
			getRefreshToken,
			process.env.REFRESH_TOKEN_SECRET
		);
		const user = await this.userModel.findOne({ _id: verifiedToken.userId });
		const verified = user.verification === verifiedToken.verification;

		if (verified) {
			const { token, refreshToken } = await this.createAndSaveTokens(user);
			await this.createCookie(res, refreshToken);
			return { token, refreshToken, user };
		} else {
			const errMsg = 'could not issue new tokens. user must log in again';
			return { err: new ValidationError(403, errMsg) };
		}
	};

	createProfile = async user => {
		const profile = await this.profileModel.create({
			user: user.id,
			username: user.username
		});
		return { profile };
	};

	getUserByEmailAndPassword = async fields => {
		const trimmedRequest = trimRequest(fields);
		const { user, err } = await this.getUserByEmail(trimmedRequest.email);
		if (err) return { err };
		const isValidPassword = await comparePasswordBcrypt(
			trimmedRequest.password,
			user.password
		);
		if (!isValidPassword) {
			const errMsg = 'user password does not match our records';
			const err = new ValidationError(400, errMsg);
			return { err };
		}
		return { user: makeAuthUser(user) };
	};

	getUserByEmail = async email => {
		const user = await this.userModel.findOne({ email });
		if (!user) {
			const errMsg = 'user email does not match our records';
			const err = new ValidationError(400, errMsg);
			return { err };
		}
		return { user };
	};

	getUserById = async userId => {
		if (userId && isValidObjId(userId)) {
			let user = await this.userModel.findOne({ _id: userId });
			if (!user) {
				const errMsg = 'user does not match our records';
				const err = new ValidationError(400, errMsg);
				return { err };
			}
			return { user: makeAuthUser(user) };
		} else {
			const errMsg = `invalid object id => ${userId}`;
			const err = new ValidationError(400, errMsg);
			return { err };
		}
	};

	getAllUsers = async () => {
		const users = await this.userModel.find({});
		if (!users) {
			const errMsg = 'error retrieving users';
			const err = new ValidationError(400, errMsg);
			return { err };
		}
		const copiedUsers = users.map(user => makeUserObj(user));
		return { users: copiedUsers };
	};

	findAndRemoveUser = async (authUser, userId) => {
		if (authUser.id.toString() === userId.toString() || authUser.role === 'admin') {
			const user = await this.userModel.findOneAndDelete({
				_id: userId
			});
			const errMsg = 'error retrieving user from database';
			if (!user) return { err: new ValidationError(400, errMsg) };
			return { user: makeAuthUser(user) };
		} else {
			return { err: new ValidationError(401, 'unauthorized request') };
		}
	};
}

module.exports = UserDatabaseService;
