const { makeUserProfile } = require('../helpers/user-auth');
const { ValidationError } = require('../middleware/utils/errors');

module.exports = class ProfileDatabaseService {
	constructor(userModel) {
		this.profile = userModel;
	}

	fetchUserProfile = async username => {
		const query = { username };
		const profile = await this.profile.findOne(query);
		if (!profile) {
			return {
				err: new ValidationError(400, 'error fetching profile')
			};
		}
		console.log('profile %s', profile);
		return { profile: await makeUserProfile(profile) };
	};

	fetchFollowService = async authUser => {
		const user = await this.profile.findOne({ _id: authUser.id });
		const updatedUser = await user.follow(user._id);
		console.log(updatedUser);
		return { profile: await makeUserProfile(updatedUser) };
	};
};
