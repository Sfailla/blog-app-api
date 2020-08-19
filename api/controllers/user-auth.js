module.exports = class AuthController {
	constructor(databaseService, userServiceError) {
		this.db = databaseService;
		this.userError = (statusCode, message) => {
			return new userServiceError(statusCode, message);
		};
	}

	registerUser = async (req, res, next) => {
		try {
			const { user, token, err } = await this.db.createUser(
				req.body.username,
				req.body.email,
				req.body.password
			);

			if (err) throw this.userError(err.code, err.msg);

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
			const { getUserByEmailAndPassword } = this.db;
			const { user, token, err } = await getUserByEmailAndPassword(
				req.body.email,
				req.body.password
			);

			if (err) throw this.userError(err.code, err.msg);

			await res
				.header('x-auth-token', token)
				.status(200)
				.json({ user });
		} catch (error) {
			next(error);
		}
	};

	getCurrentUser = async (req, res, next) => {};

	getAllUsers = async (req, res, next) => {
		try {
			const { users, err } = await this.db.getAllUsers();
			if (err) throw this.userError(err.code, err.msg);

			await res.status(200).json({ users });
		} catch (error) {
			next(error);
		}
	};
};
