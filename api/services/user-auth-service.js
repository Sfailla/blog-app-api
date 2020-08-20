const { buildErrorObject } = require('../middleware/utils/errors');
const { isValidObjId } = require('../config/db/config');
const {
	generateAuthToken,
	hashPasswordBcrypt,
	comparePasswordBcrypt,
	basicUserDetails
} = require('../helpers/user-auth');

class UserDatabaseService {
	constructor(userModel) {
		this.userModel = userModel;
	}

	createUser = async (username, email, password) => {
		const hashedPassword = await hashPasswordBcrypt(password);
		let user = await this.userModel.create({
			username,
			email,
			password: hashedPassword
		});
		if (!user) {
			return { err: buildErrorObject(400, 'error creating user') };
		} else {
			user = basicUserDetails(user);
			const token = generateAuthToken(user);
			return { user, token };
		}
	};

	getUserByEmailAndPassword = async (email, password) => {
		let { user } = await this.getUserByEmail(email);
		const isValidPassword = await comparePasswordBcrypt(
			password,
			user.password
		);
		if (!isValidPassword) {
			const errMsg = 'user password does not match our records';
			return { err: buildErrorObject(400, errMsg) };
		}
		user = basicUserDetails(user);
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
		if (userId && isValidObjId(userId)) {
			let user = await this.userModel.findOne({ _id: userId });
			if (!user) {
				const errMsg = 'user does not match our records';
				return { err: buildErrorObject(400, errMsg) };
			}
			user = basicUserDetails(user);
			return { user };
		} else {
			return {
				err: buildErrorObject(400, `invalid object id => ${userId}`)
			};
		}
	};

	getAllUsers = async () => {
		const users = await this.userModel.find({});
		if (!users) {
			const errMsg = 'there was an error locating users';
			return { err: buildErrorObject(400, errMsg) };
		}
		const copiedUsers = users.map(user => basicUserDetails(user));
		return { users: copiedUsers };
	};
}

module.exports = UserDatabaseService;
