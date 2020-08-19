const {
	generateAuthToken,
	hashPasswordBcrypt,
	comparePasswordBcrypt
} = require('../helpers/user-auth');

const { buildErrorObject } = require('../middleware/utils/errors');

class UserDatabaseService {
	constructor(userModel) {
		this.userModel = userModel;
	}

	createUser = async (username, email, password) => {
		const hashedPassword = await hashPasswordBcrypt(password);
		const user = await this.userModel.create({
			username,
			email,
			password: hashedPassword
		});
		if (!user) {
			return { err: buildErrorObject(400, 'error creating user') };
		} else {
			const token = generateAuthToken(user);
			return { user, token };
		}
	};

	getUserByEmailAndPassword = async (email, password) => {
		const { user } = await this.getUserByEmail(email);
		const isValidPassword = await comparePasswordBcrypt(
			password,
			user.password
		);
		if (!isValidPassword) {
			const errMsg = 'user password does not match our records';
			return { err: buildErrorObject(400, errMsg) };
		}
		const token = generateAuthToken(user);
		return { user, token };
	};

	getUserByEmail = async email => {
		const user = await this.userModel.findOne({ email });
		if (!user) {
			const errMsg = 'user email does not match our records';
			return { err: buildErrorObject(400, errMsg) };
		}
		return { user };
	};

	getUserById = async userId => {
		const user = await this.userModel
			.isValidObjectId(userId)
			.find({ _id: userId });

		if (!user) {
			const errMsg = 'user id does not match our records';
			return { err: buildErrorObject(400, errMsg) };
		}
		return { user };
	};

	getAllUsers = async () => {
		const users = await this.userModel.find({});
		if (!users) {
			const errMsg = 'there was an error locating users';
			return { err: buildErrorObject(400, errMsg) };
		}
		return { users };
	};
}

module.exports = UserDatabaseService;
