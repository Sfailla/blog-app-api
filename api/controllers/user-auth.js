module.exports = class AuthController {
	constructor(authService) {
		this.auth = authService;
	}

	registerUser = async (req, res) => {
		const { username, email, password } = req.body;
		const { user, token } = await this.auth.createUser(
			username,
			email,
			password
		);

		await res.status(200).json({ user, token });
	};

	loginUser = async (req, res) => {
		const { email, password } = req.body;

		const { user, token } = await this.auth.getUserByEmailAndPassword(
			email,
			password
		);

		res.status(200).json({ user, token });
	};

	getCurrentUser = async (req, res) => {};

	getAllUsers = async (req, res) => {
		const { users } = await this.auth.getAllUsers();

		await res.status(200).json({ users });
	};
};
