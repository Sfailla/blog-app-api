const {
	generateAuthToken,
	hashPasswordBcrypt,
	verifyPasswordReturnToken
} = require('../helpers/user-auth');

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

		const token = generateAuthToken(user);

		return { user, token };
	};

	getUserByEmailAndPassword = async (email, password) => {
		const user = await this.userModel.findOne({ email });
		const token = await verifyPasswordReturnToken(password, user);

		return { user, token };
	};

	getUserByEmail = async email => {
		const user = await this.userModel.find({ email });
		return { user };
	};

	getUserById = async id => {
		const user = await this.userModel.find({ _id: id });
		return { user };
	};

	getAllUsers = async () => {
		const users = await this.userModel.find({});

		return { users };
	};
}

module.exports = UserDatabaseService;
