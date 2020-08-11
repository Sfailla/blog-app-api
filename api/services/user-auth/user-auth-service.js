const {
	generateAuthToken,
	hashPasswordBcrypt,
	verifyPasswordReturnToken
} = require('../../helpers/user-auth');

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

		const token = generateAuthToken(user._id);

		return { user, token };
	};

	getUserByEmailAndPassword = async (email, password) => {
		const user = await this.userModel.findOne({ email });
		const token = await verifyPasswordReturnToken(password, user);

		return { user, token };
	};

	getUserById = async id => {};

	getAllUsers = async () => {
		const users = await this.userModel.find({});

		return { users };
	};
}

module.exports = UserDatabaseService;
