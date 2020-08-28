const { ValidationError } = require('../middleware/utils/errors');
const { isValidObjId } = require('../config/db/config');
const {
	generateAuthToken,
	hashPasswordBcrypt,
	comparePasswordBcrypt,
	copyUserDetails
} = require('../helpers/user-auth');

class UserDatabaseService {
	constructor(userModel) {
		this.userModel = userModel;
	}

	createUser = async userFields => {
		const hashedPassword = await hashPasswordBcrypt(
			userFields.password
		);
		let user = await this.userModel.create({
			...userFields,
			password: hashedPassword
		});

		if (!user) {
			const err = new ValidationError(400, 'error creating user');
			return { err };
		} else {
			user = copyUserDetails(user);
			const token = generateAuthToken(user);
			return { user, token };
		}
	};

	getUserByEmailAndPassword = async (email, password) => {
		let { user, err } = await this.getUserByEmail(email);
		if (err) return { err };

		const isValidPassword = await comparePasswordBcrypt(
			password,
			user.password
		);
		if (!isValidPassword) {
			const errMsg = 'user password does not match our records';
			const err = new ValidationError(400, errMsg);
			return { err };
		}

		user = copyUserDetails(user);
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
		if (userId && isValidObjId(userId.toString('hex'))) {
			let user = await this.userModel.findOne({ _id: userId });
			if (!user) {
				const errMsg = 'user does not match our records';
				const err = new ValidationError(400, errMsg);
				return { err };
			}
			user = copyUserDetails(user);
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
			const errMsg = 'there was an error locating users';
			const err = new ValidationError(400, errMsg);
			return { err };
		}
		const copiedUsers = users.map(user => copyUserDetails(user));
		return { users: copiedUsers };
	};
}

module.exports = UserDatabaseService;
