module.exports = class AuthController {
	constructor(databaseService) {
		this.service = databaseService;
	}

	registerUser = async (req, res, next) => {
		try {
			const requiredFields = { ...req.body };
			const { user, token, err } = await this.service.createUser(requiredFields);
			if (err) throw err;
			return await res.header('x-auth-token', token).status(201).json({
				message: `successfully created user: ${user.username} 🤴🏻🚀`,
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
			return await res.header('x-auth-token', token).status(200).json({ user });
		} catch (error) {
			return next(error);
		}
	};

	logoutUser = async (req, res, next) => {
		return await res.send('this is the logout route!');
	};

	getCurrentUser = async (req, res, next) => {
		try {
			const { user, err } = await this.service.getUserById(req.params.id);
			if (err) throw err;
			return await res.header('x-auth-token', req.token).status(200).json({ user });
		} catch (error) {
			return next(error);
		}
	};

	getAllUsers = async (req, res, next) => {
		try {
			const { users, err } = await this.service.getAllUsers();
			if (err) throw err;
			return await res.header('x-auth-token', req.token).status(200).json({ users });
		} catch (error) {
			return next(error);
		}
	};

	deleteUserAdmin = async (req, res, next) => {
		const { user, err } = await this.service.findAndRemoveUserAdmin(
			req.user,
			req.params.id
		);
		if (err) throw err;
		return await res.status(200).json({
			message: `successfully removed user: {${user.id}:${user.username}} 🔥😱`,
			user
		});
	};
};
