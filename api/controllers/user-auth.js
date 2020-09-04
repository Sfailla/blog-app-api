module.exports = class AuthController {
	constructor(databaseService) {
		this.service = databaseService;
	}

	registerUser = async (req, res, next) => {
		try {
			const { user, token, err } = await this.service.createUser({
				username: req.body.username,
				email: req.body.email,
				password: req.body.password
			});
			if (err) throw err;
			return await res
				.header('x-auth-token', token)
				.status(201)
				.json({
					message: `successfully created user: ${user.username}`,
					user
				});
		} catch (error) {
			return next(error);
		}
	};

	loginUser = async (req, res, next) => {
		try {
			const { getUserByEmailAndPassword } = this.service;
			const { user, token, err } = await getUserByEmailAndPassword(
				req.body.email,
				req.body.password
			);
			if (err) throw err;
			return await res
				.header('x-auth-token', token)
				.status(200)
				.json({ user });
		} catch (error) {
			return next(error);
		}
	};

	logoutUser = async (req, res, next) => {
		return await res.send('this is the logout route!');
	};

	getCurrentUser = async (req, res, next) => {
		try {
			const { user, err } = await this.service.getUserById(
				req.params.id
			);
			if (err) throw err;
			return await res
				.header('x-auth-token', req.token)
				.status(200)
				.json({ user });
		} catch (error) {
			return next(error);
		}
	};

	getAllUsers = async (req, res, next) => {
		try {
			const { users, err } = await this.service.getAllUsers();
			if (err) throw err;
			return await res
				.header('x-auth-token', req.token)
				.status(200)
				.json({ users });
		} catch (error) {
			return next(error);
		}
	};
};
