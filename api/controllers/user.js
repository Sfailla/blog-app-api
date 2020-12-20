module.exports = class AuthController {
	constructor(databaseService) {
		this.service = databaseService;
	}

	// may need below to expose tokens to client
	// res.set('Access-Control-Expose-Headers', 'x-auth-token', 'x-refresh-token');
	// res.set('Access-Control-Allow-Headers', 'x-auth-token', 'x-refresh-token');

	registerUser = async (req, res, next) => {
		try {
			const { user, err } = await this.service.createUser(req.body);
			const { token, refreshToken } = await this.service.createAndSaveTokens(user);
			if (err) throw err;
			await this.service.createProfile(user);
			await this.service.createCookie(res, refreshToken);

			res.set('x-auth-token', token);
			res.set('x-refresh-token', refreshToken);
			return await res.status(201).json({
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
			const { user, err } = await getUserByEmailAndPassword(req.body, req);
			if (err) throw err;
			const { token, refreshToken } = await this.service.createAndSaveTokens(user);
			await this.service.createCookie(res, refreshToken);
			res.set('x-auth-token', token);
			res.set('x-refresh-token', refreshToken);
			return await res.status(200).json({ user });
		} catch (error) {
			return next(error);
		}
	};

	logoutUser = async (req, res, next) => {
		const refreshToken = await this.service.readCookie(req);
		await this.service.deleteUserTokenOnLogout(res, req.user, refreshToken);
		return await res.json({
			message: 'user successfully logged out!'
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
				message: `successfully removed user: ${user.username}`,
				user
			});
		} catch (error) {
			next(error);
		}
	};

	refreshTokens = async (req, res, next) => {
		try {
			const {
				token,
				refreshToken,
				user,
				err
			} = await this.service.findAndRefreshTokens(req, res);
			if (err) throw err;
			res.set('x-auth-token', token);
			res.set('x-refresh-token', refreshToken);
			return await res.status(200).json({
				token,
				refreshToken,
				user
			});
		} catch (error) {
			next(error);
		}
	};

	revokeToken = async (req, res, next) => {
		try {
			const { revokedToken, revokedUser, err } = await this.service.revokeUserToken(
				req.user,
				req.params.token
			);
			if (err) throw err;
			return await res.status(200).json({ revokedToken, revokedUser });
		} catch (error) {
			next(error);
		}
	};
};
