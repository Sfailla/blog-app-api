module.exports = class AuthService {
	constructor(userModel) {
		this.userModel = userModel;
	}

	createUser = async (username, email, password) => {
		const user = await this.userModel.create({
			username,
			email,
			password
		});

		return { user };
	};

	getUserByEmail = async email => {};
	getUserById = async id => {};
	getAllUsers = async () => {};
};
