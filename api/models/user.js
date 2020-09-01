const mongoose = require('mongoose');
const validator = require('validator');
const { Schema, Types, model } = mongoose;
const { ObjectId } = Types;

const typeProps = { trim: true, unique: true, index: true };
const requiredString = {
	type: String,
	required: [ true, 'must provide field' ]
};
const options = {
	virtuals: true,
	versionKey: false,
	transform: (_, ret) => {
		delete ret._id;
		delete ret.password;
	}
};

const UserSchema = new Schema(
	{
		username: { ...requiredString, ...typeProps },
		email: {
			...requiredString,
			...typeProps,
			set: value => value.toLowerCase(),
			validate: {
				validator: value => {
					return validator.isEmail(value);
				},
				message: '{VALUE} is not a valid email address'
			}
		},
		password: { ...requiredString, trim: true },
		name: { type: String, default: null },
		bio: { type: String, default: null },
		image: { type: String, default: null },
		favorites: [ { type: ObjectId, ref: 'Article' } ],
		following: [ { type: ObjectId, ref: 'User' } ],
		role: {
			type: String,
			enum: [ 'user', 'moderator', 'admin' ],
			default: 'user'
		},
		createdAt: { type: Date, default: Date.now }
	},
	{ toJSON: options }
);

UserSchema.methods.favorite = async function(articleId) {
	if (!this.favorites.includes(articleId)) {
		this.favorites.push(articleId);
	}
	return await this.save();
};

UserSchema.methods.unfavorite = async function(articleId) {
	if (this.favorites.includes(articleId)) {
		await this.favorites.remove(articleId);
	}
	return await this.save();
};

UserSchema.methods.isFavorite = function(articleId) {
	if (!this.favorites.length) return false;
	return this.favorites.some(favoriteId => {
		return favoriteId.toString() === articleId.toString();
	});
};

UserSchema.methods.follow = async function(userId) {
	if (!this.following.includes(userId)) {
		await this.following.push(userId);
	}
	return await this.save();
};

UserSchema.methods.unfollow = async function(userId) {
	if (this.following.includes(userId)) {
		await this.following.remove(userId);
	}
	return await this.save();
};

UserSchema.methods.isFollowing = function(userId) {
	if (!this.following.length) return false;
	return this.following.some(followId => {
		return followId.toString() === userId.toString();
	});
};

module.exports = model('User', UserSchema);
