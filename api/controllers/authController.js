module.exports = class AuthController {
	constructor(AuthService) {
		this.auth = AuthService;
	}

	registerUser = async (req, res) => {
		const { username, email, password } = req.body;
		const { user } = await this.auth.registerUser(
			username,
			email,
			password
		);

		await res.status(200).json({ user });
	};

	loginUser = async (req, res) => {};
	getUser = async (req, res) => {};
};
