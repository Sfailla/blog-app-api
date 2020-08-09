const { randomBytes } = require('crypto');

const users = {};

const createUser = async (req, res) => {
	const id = randomBytes(4).toString('hex');
	const { username, email, password } = req.body;

	users[id] = {
		id,
		username,
		email,
		password,
		createdAt: Date.now()
	};

	await res.status(200).send(users);
};

const getUser = async (req, res) => {
	await res.status(200).json({
		userMessage: 'here are the users 😎 ',
		users
	});
};

module.exports = { createUser, getUser };
