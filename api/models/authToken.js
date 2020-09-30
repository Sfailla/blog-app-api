const mongoose = require('mongoose');
const { Schema, Types, model } = mongoose;
const { ObjectId } = Types;

const options = {
	virtuals: true,
	versionKey: false,
	transform: (_, ret) => {
		console.log(ret);
		delete ret._id;
	}
};

const AuthTokenSchema = new Schema(
	{
		user: { type: ObjectId, ref: 'User' },
		token: { type: String, required: true, unique: true, index: true },
		newToken: { type: String, unique: true, default: null },
		revoked: { type: Date, default: null },
		expires: { type: Date },
		createdAt: { type: Date, default: Date.now }
	},
	{ toJSON: options }
);

AuthTokenSchema.virtual('isExpired').get(function() {
	return Date.now() >= this.expires;
});

AuthTokenSchema.virtual('isActive').get(function() {
	return !this.revoked && !this.isExpired;
});

module.exports = model('AuthToken', AuthTokenSchema);