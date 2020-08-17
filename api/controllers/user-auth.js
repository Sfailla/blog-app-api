const { handleError } = require('../middleware/utils/http-error');

module.exports = class AuthController {
	constructor(database) {
		this.db = database;
	}

	registerUser = async (req, res) => {
		try {
			const { username, email, password } = req.body;
			const { user, token } = await this.db.createUser(
				username,
				email,
				password
			);

			await res
				.header('x-auth-token', token)
				.status(201)
				.json({ user });
		} catch (error) {
			console.log('caught err');
			handleError(res, error);
		}
	};

	loginUser = async (req, res) => {
		try {
			const { email, password } = req.body;
			const { user, token } = await this.db.getUserByEmailAndPassword(
				email,
				password
			);

			await res
				.header('x-auth-token', token)
				.status(200)
				.json({ user });
		} catch (error) {
			handleError(res, error);
		}
	};

	getCurrentUser = async (req, res) => {};

	getAllUsers = async (req, res) => {
		const { users } = await this.db.getAllUsers();

		await res.status(200).json({ users });
	};
};
