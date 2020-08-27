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

UserSchema.methods.favorite = function(articleId) {
	if (this.favorites.indexOf(articleId) === -1) {
		this.favorites.push(articleId);
	}
	return this.save();
};

UserSchema.methods.unfavorite = function(articleId) {
	if (this.favorites.includes(articleId)) {
		this.remove(articleId);
	}
	return this.save();
};

module.exports = model('User', UserSchema);
