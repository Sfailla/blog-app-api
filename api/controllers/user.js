module.exports = class AuthController {
	constructor(databaseService, taskRunner) {
		this.service = databaseService;
		this.cron = taskRunner;
		this.task = this.cron.schedule(
			'* * * * *',
			() => {
				console.log('scheduled task');
			},
			{ scheduled: false }
		);
	}

	// may need below to expose tokens to client
	// res.set('Access-Control-Expose-Headers', 'x-auth-token', 'x-refresh-token');
	// res.set('Access-Control-Allow-Headers', 'x-auth-token', 'x-refresh-token');

	registerUser = async (req, res, next) => {
		try {
			const { user, err } = await this.service.createUser(req.body);
			const { token, refreshToken } = await this.service.createTokens(user);
			if (err) throw err;
			await this.service.createProfile(user);
			await this.service.createCookie(res, refreshToken);
			await this.task.start();
			res.set('x-auth-token', token);
			res.set('x-refresh-token', refreshToken);
			return await res.status(201).json({
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
			const { user, err } = await getUserByEmailAndPassword(req.body);
			if (err) throw err;
			const { token, refreshToken } = await this.service.createAndSaveTokens(user);
			await this.service.createCookie(res, refreshToken);

			await this.task.start();

			res.set('x-auth-token', token);
			res.set('x-refresh-token', refreshToken);
			return await res.status(200).json({ user });
		} catch (error) {
			return next(error);
		}
	};

	logoutUser = async (req, res, next) => {
		await this.task.stop();
		await this.task.destroy();
		return await res.send('this is the logout route!');
	};

	refreshTokens = async (req, res, next) => {
		const { token, refreshToken, user } = await this.service.findAndRefreshTokens(
			req,
			res
		);
		res.set('x-auth-token', token);
		res.set('x-refresh-token', refreshToken);
		return await res.status(200).json({
			token,
			refreshToken,
			user
		});
	};

	getCurrentUser = async (req, res, next) => {
		try {
			const { user, err } = await this.service.getUserById(req.params.id);
			if (err) throw err;
			return await res.status(200).json({ user });
		} catch (error) {
			return next(error);
		}
	};

	getAllUsers = async (req, res, next) => {
		try {
			const { users, err } = await this.service.getAllUsers();
			if (err) throw err;
			return await res.status(200).json({ users });
		} catch (error) {
			return next(error);
		}
	};

	deleteUser = async (req, res, next) => {
		try {
			const { user, err } = await this.service.findAndRemoveUser(
				req.user,
				req.params.id
			);
			if (err) throw err;
			return await res.status(200).json({
				message: `successfully removed user: ${user.username} 🔥😱`,
				user
			});
		} catch (error) {
			next(error);
		}
	};
};
