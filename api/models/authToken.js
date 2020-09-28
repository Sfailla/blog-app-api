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
		author: { type: ObjectId, ref: 'User' },
		token: { type: String, required: true, unique: true, index: true },
		newToken: { type: String, unique: true, default: null },
		revoked: { type: Date },
		expires: { type: Date },
		createdAt: { type: Date, default: Date.now }
	},
	{ toJSON: options }
);

schema.virtual('isExpired').get(function() {
	return Date.now() >= this.expires;
});

schema.virtual('isActive').get(function() {
	return !this.revoked && !this.isExpired;
});

module.exports = model('AuthToken', AuthTokenSchema);
