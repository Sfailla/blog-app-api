module.exports = class AuthController {
	constructor(database) {
		this.db = database;
	}

	registerUser = async (req, res) => {
		const { username, email, password } = req.body;
		const { user, token } = await this.db.createUser(
			username,
			email,
			password
		);

		await res.status(200).json({ user, token });
	};

	loginUser = async (req, res) => {
		const { email, password } = req.body;

		const { user, token } = await this.db.getUserByEmailAndPassword(
			email,
			password
		);

		res.status(200).json({ user, token });
	};

	getCurrentUser = async (req, res) => {};

	getAllUsers = async (req, res) => {
		const { users } = await this.db.getAllUsers();

		await res.status(200).json({ users });
	};
};
