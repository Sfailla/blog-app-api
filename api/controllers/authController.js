module.exports = class AuthController {
	constructor(authService) {
		this.auth = authService;
	}

	registerUser = async (req, res) => {
		const { username, email, password } = req.body;
		const { user } = await this.auth.createUser(
			username,
			email,
			password
		);

		await res.status(200).json({ user });
	};

	loginUser = async (req, res) => {};
	getUser = async (req, res) => {};
};
