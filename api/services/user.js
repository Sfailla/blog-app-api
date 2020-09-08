const { ValidationError } = require('../middleware/utils/errors');
const { isValidObjId } = require('../database/db/index');
const { trimRequest } = require('../helpers/validation');
const {
	generateAuthToken,
	hashPasswordBcrypt,
	comparePasswordBcrypt,
	copyUserObj,
	makeAuthUser
} = require('../helpers/user-auth');

class UserDatabaseService {
	constructor(userModel) {
		this.userModel = userModel;
	}

	createUser = async userFields => {
		const sanitized = trimRequest(userFields);
		const hashedPassword = await hashPasswordBcrypt(sanitized.password);
		let user = await this.userModel.create({
			...sanitized,
			password: hashedPassword
		});

		if (!user) {
			const err = new ValidationError(400, 'error creating user');
			return { err };
		} else {
			user = makeAuthUser(user);
			const token = generateAuthToken(user);
			return { user, token };
		}
	};

	getUserByEmailAndPassword = async fields => {
		const sanitized = trimRequest(fields);
		let { user, err } = await this.getUserByEmail(sanitized.email);
		if (err) return { err };

		const isValidPassword = await comparePasswordBcrypt(
			sanitized.password,
			user.password
		);
		if (!isValidPassword) {
			const errMsg = 'user password does not match our records';
			const err = new ValidationError(400, errMsg);
			return { err };
		}

		user = makeAuthUser(user);
		const token = generateAuthToken(user);
		return { user, token };
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
			user = copyUserObj(user);
			return { user };
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
		const copiedUsers = users.map(user => copyUserObj(user));
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
