const mongoose = require('mongoose');
const validator = require('validator');

const { Schema, model } = mongoose;

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
			unique: true
		},
		email: {
			...requiredString,
			trim: true,
			unique: true,
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
				message: '{VALUE} is not a valid password'
			}
		},
		role: {
			type: String,
			enum: [ 'user', 'moderator', 'admin' ],
			default: 'user'
		},
		createdAt: {
			type: Date,
			default: Date.now,
			validate: {
				validator: value => {
					return validator.isDate(value);
				},
				message: '{VALUE} must be type date'
			}
		}
	},
	{ toJSON: options }
);

module.exports = model('User', UserSchema);
