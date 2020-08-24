const mongoose = require('mongoose');
const validator = require('validator');

const { Schema, Types, model } = mongoose;
const { ObjectId } = Types;

const requiredString = {
	type: String,
	required: true
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
		username: {
			...requiredString,
			trim: true,
			unique: true,
			index: true
		},
		email: {
			...requiredString,
			trim: true,
			unique: true,
			index: true,
			set: value => value.toLowerCase(),
			validate: {
				validator: value => {
					return validator.isEmail(value);
				},
				message: '{VALUE} is not a valid email address'
			}
		},
		password: {
			...requiredString,
			trim: true,
			validate: {
				validator: value => {
					return !validator.isEmpty(value);
				},
				message: 'must provide a password'
			}
		},
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

module.exports = model('User', UserSchema);
