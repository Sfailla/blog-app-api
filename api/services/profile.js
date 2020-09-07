const { makeUserProfile } = require('../helpers/user-auth');
const { ValidationError } = require('../middleware/utils/errors');
const { trimRequest } = require('../helpers/validation');

module.exports = class ProfileDatabaseService {
	constructor(userModel) {
		this.profile = userModel;
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
		const user = await this.profile.findOne({ _id: authUser.id });
		const updatedUser = await user.follow(follower._id);
		if (!follower || !user || !updatedUser) {
			const errMsg = 'error initializing fetch to follow user';
			const err = new ValidationError(400, errMsg);
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
			const errMsg = 'error initializing fetch to follow user';
			const err = new ValidationError(400, errMsg);
			return { err };
		}
		return {
			profile: await makeUserProfile(follower, updatedUser)
		};
	};

	findProfileAndUpdate = async (authUser, updates) => {
		const query = { _id: authUser.id };
		const update = { ...trimRequest(updates) };
		const profile = await this.profile.findOneAndUpdate(query, update, {
			new: true
		});
		if (!profile) {
			const errMsg = 'error updating user profile';
			const err = ValidationError(400, errMsg);
			return { err };
		}
		return { profile: await makeUserProfile(profile) };
	};
};
