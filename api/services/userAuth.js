module.exports = class AuthService {
	constructor(UserModel) {
		this.userModel = UserModel;
	}

	registerUser = async (username, email, password) => {
		const user = await this.userModel.create({
			username,
			email,
			password
		});

		return { user };
	};

	loginUser = async (req, res) => {};

	// getAllUsers = async (req, res) => {
	// 	await res.status(200).json({
	// 		userMessage: 'here are the users 😎 ',
	// 		users: this.users.length ? this.users : 'sorry no users yet'
	// 	});
	// };
};
