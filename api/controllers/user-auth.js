module.exports = class AuthController {
	constructor(database, userServiceError) {
		this.db = database;
		this.userError = (statusCode, message) =>
			new userServiceError(statusCode, message);
	}

	registerUser = async (req, res, next) => {
		try {
			const { username, email, password } = req.body;
			const { user, token, error } = await this.db.createUser(
				username,
				email,
				password
			);

			if (error) throw this.userError(400, error.message);

			await res
				.header('x-auth-token', token)
				.status(201)
				.json({ user });
		} catch (error) {
			next(error);
		}
	};

	loginUser = async (req, res, next) => {
		try {
			const { email, password } = req.body;
			const {
				user,
				token,
				error
			} = await this.db.getUserByEmailAndPassword(email, password);

			if (error) throw this.userError(400, error.message);

			await res
				.header('x-auth-token', token)
				.status(200)
				.json({ user });
		} catch (error) {
			next(error);
		}
	};

	getCurrentUser = async (req, res) => {};

	getAllUsers = async (req, res) => {
		const { users } = await this.db.getAllUsers();

		await res.status(200).json({ users });
	};
};
