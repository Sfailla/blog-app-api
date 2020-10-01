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

const validateEmail = {
	validator: value => {
		return validator.isEmail(value);
	},
	message: '{VALUE} is not a valid email address'
};

const UserSchema = new Schema(
	{
		username: { ...requiredString, ...typeProps },
		email: {
			...requiredString,
			...typeProps,
			lowercase: true,
			validate: validateEmail
		},
		password: { ...requiredString, trim: true },
		role: {
			type: String,
			enum: [ 'user', 'moderator', 'admin' ],
			default: 'user'
		},
		verification: { type: String, required: true, unique: true },
		createdAt: { type: Date, default: Date.now }
	},
	{ toJSON: options }
);

module.exports = model('User', UserSchema);
