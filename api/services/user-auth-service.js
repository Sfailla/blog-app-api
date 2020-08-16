const {
	generateAuthToken,
	hashPasswordBcrypt,
	comparePasswordBcrypt
} = require('../helpers/user-auth');
const {
	buildErrorObject
} = require('../middleware/utils/http-error');

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
			console.log('user err');
			return buildErrorObject(400, 'error creating user');
		} else {
			const token = generateAuthToken(user);
			return { user, token };
		}
	};

	getUserByEmailAndPassword = async (email, password) => {
		const user = await this.userModel.findOne({ email });

		if (!user) buildErrorObject(400, 'user email does not match');

		const isValidPassword = await comparePasswordBcrypt(
			password,
			user.password
		);

		if (!isValidPassword)
			buildErrorObject(400, 'user password does not match');

		const token = generateAuthToken(user);

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
