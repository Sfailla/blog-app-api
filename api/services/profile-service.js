const { makeUserProfile } = require('../helpers/user-auth');
const { ValidationError } = require('../middleware/utils/errors');

module.exports = class ProfileDatabaseService {
	constructor(userModel) {
		this.profile = userModel;
	}

	fetchUserProfile = async username => {
		const profile = await this.profile.findOne({ username });
		if (!profile) {
			const err = new ValidationError(400, 'error fetching profile');
			return { err };
		}
		return { profile: await makeUserProfile(profile) };
	};

	followService = async (authUser, username) => {
		const follower = await this.profile.findOne({
			username
		});
		const user = await this.profile.findOne({ _id: authUser.id });
		const updatedUser = await user.follow(follower._id);
		if (!follower || !user || !updatedUser) {
			const err = new ValidationError(
				400,
				'error initializing fetch to follow user'
			);
			return { err };
		}
		return {
			profile: await makeUserProfile(follower, updatedUser)
		};
	};

	unfollowService = async (authUser, username) => {
		const follower = await this.profile.findOne({
			username
		});
		const user = await this.profile.findOne({ _id: authUser.id });
		const updatedUser = await user.unfollow(follower._id);
		if (!follower || !user || !updatedUser) {
			const err = new ValidationError(
				400,
				'error initializing fetch to follow user'
			);
			return { err };
		}

		return {
			profile: await makeUserProfile(follower, updatedUser)
		};
	};
};
