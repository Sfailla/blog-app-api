const mongoose = require('mongoose');
const { Schema, Types, model } = mongoose;
const { ObjectId } = Types;

const options = {
	virtuals: true,
	versionKey: false,
	transform: (_, ret) => {
		delete ret._id;
	}
};

const ProfileSchema = new Schema(
	{
		user: { type: ObjectId, ref: 'User' },
		username: { type: String },
		name: { type: String, default: null },
		bio: { type: String, default: null },
		image: { type: String, default: null },
		favorites: [ { type: ObjectId, ref: 'Article' } ],
		following: [ { type: ObjectId, ref: 'User' } ]
	},
	{ toJSON: options }
);

ProfileSchema.methods.favorite = async function(articleId) {
	if (!this.favorites.includes(articleId)) {
		this.favorites.push(articleId);
	}
	return await this.save();
};

ProfileSchema.methods.unfavorite = async function(articleId) {
	if (this.favorites.includes(articleId)) {
		await this.favorites.remove(articleId);
	}
	return await this.save();
};

ProfileSchema.methods.isFavorite = function(articleId) {
	return this.favorites.some(favoriteId => {
		return favoriteId.toString() === articleId.toString();
	});
};

ProfileSchema.methods.follow = async function(userId) {
	if (!this.following.includes(userId)) {
		await this.following.push(userId);
	}
	return await this.save();
};

ProfileSchema.methods.unfollow = async function(followId) {
	if (this.following.includes(followId)) {
		await this.following.remove(followId);
	}
	return await this.save();
};

ProfileSchema.methods.isFollowing = function(userId) {
	return this.following.some(followId => {
		return followId.toString() === userId.toString();
	});
};

module.exports = model('Profile', ProfileSchema);
