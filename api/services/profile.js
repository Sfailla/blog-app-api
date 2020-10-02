const { makeUserProfile } = require('../helpers/user-auth');
const { ValidationError } = require('../middleware/utils/errors');
const { trimRequest } = require('../helpers/validation');

module.exports = class ProfileDatabaseService {
	constructor(profileModel) {
		this.profile = profileModel;
	}

	fetchUserProfile = async username => {
		const profile = await this.profile.findOne({ username });
		if (!profile) {
			const errMsg = 'error fetching user profile';
			const err = new ValidationError(400, errMsg);
			return { err };
		}
		return { profile: await makeUserProfile(profile) };
	};

	followService = async (authUser, username) => {
		const follower = await this.profile.findOne({
			username
		});
		const getProfile = await this.profile.findOne({ user: authUser.id });
		const profile = await getProfile.follow(follower._id);

		if (!follower || !getProfile || !profile) {
			const errMsg = 'error initializing fetch to follow user';
			const err = new ValidationError(400, errMsg);
			return { err };
		}
		return {
			profile: await makeUserProfile(profile, follower)
		};
	};

	unfollowService = async (authUser, username) => {
		const follower = await this.profile.findOne({
			username
		});
		const getProfile = await this.profile.findOne({ _id: authUser.id });
		const profile = await getProfile.unfollow(follower._id);

		if (!follower || !getProfile || !profile) {
			const errMsg = 'error initializing fetch to follow user';
			const err = new ValidationError(400, errMsg);
			return { err };
		}
		return {
			profile: await makeUserProfile(profile, follower)
		};
	};

	findProfileAndUpdate = async (authUser, updates) => {
		const query = { user: authUser.id };
		const update = { ...trimRequest(updates) };
		const profile = await this.profile.findOneAndUpdate(query, update, {
			new: true
		});

		if (!profile) {
			const errMsg = 'error updating user profile';
			const err = new ValidationError(400, errMsg);
			return { err };
		}
		return { profile: await makeUserProfile(profile) };
	};
};
