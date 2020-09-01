module.exports = class ProfileController {
	constructor(databaseService) {
		this.service = databaseService;
	}

	getProfile = async (req, res, next) => {
		try {
			const { profile, err } = await this.service.fetchUserProfile(
				req.params.username
			);
			console.log(profile);
			if (err) throw err;
			return await res.status(200).json({ profile });
		} catch (error) {
			return next(error);
		}
	};

	followUser = async (req, res, next) => {
		const { profile } = await this.service.fetchFollowService(
			req.user
		);
		console.log(profile);
		return await res.status(200).json({ profile });
	};
};
