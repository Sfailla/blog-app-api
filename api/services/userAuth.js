const { randomBytes } = require('crypto');
const UserModel = require('../models/user/user');

module.exports = class AuthService {
	constructor(UserModel) {
		this.userModel = UserModel;
		this.users = {};
	}

	createUser = async (req, res) => {
		const id = randomBytes(4).toString('hex');
		const { username, email, password } = req.body;

		this.users[id] = {
			id,
			username,
			email,
			password,
			createdAt: Date.now()
		};

		await res.status(200).send(this.users);
	};

	getAllUsers = async (req, res) => {
		await res.status(200).json({
			userMessage: 'here are the users 😎 ',
			users: this.users
		});
	};
};
