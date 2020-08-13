const requireAdmin = async () => {
	const token =
		// req.header('x-auth-token') ||
		req.headers['authorization'];

	const user = await verifyAuthToken(token);

	console.log(user);
};

module.exports = requireAdmin;
