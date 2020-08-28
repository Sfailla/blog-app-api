module.exports = class AuthController {
	constructor(databaseService) {
		this.db = databaseService;
	}

	registerUser = async (req, res, next) => {
		try {
			const { user, token, err } = await this.db.createUser({
				username: req.body.username,
				email: req.body.email,
				password: req.body.password
			});
			if (err) throw err;
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
			if (err) throw err;
			await res
				.header('x-auth-token', token)
				.status(200)
				.json({ user });
		} catch (error) {
			next(error);
		}
	};

	logoutUser = async (req, res, next) => {
		await res.send('this is the logout route!');
	};

	getCurrentUser = async (req, res, next) => {
		try {
			const { user, err } = await this.db.getUserById(req.params.id);
			if (err) throw err;
			await res
				.header('x-auth-token', req.token)
				.status(200)
				.json({ user });
		} catch (error) {
			next(error);
		}
	};

	getAllUsers = async (req, res, next) => {
		try {
			const { users, err } = await this.db.getAllUsers();
			if (err) throw err;
			await res
				.header('x-auth-token', req.token)
				.status(200)
				.json({ users });
		} catch (error) {
			next(error);
		}
	};
};
