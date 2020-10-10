const mongoose = require('mongoose');
const { Schema, Types, model } = mongoose;
const { ObjectId } = Types;

const defaultExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

const AuthTokenSchema = new Schema(
	{
		user: { type: ObjectId, ref: 'User' },
		token: { type: String, trim: true, unique: true, index: true },
		revoked: { type: Boolean, default: false },
		createdByIp: { type: String, default: null },
		expires: { type: Date, default: defaultExpiration },
		createdAt: { type: Date, default: Date.now }
	},
	{
		toJSON: {
			virtuals: true,
			versionKey: false,
			transform: (_, ret) => {
				delete ret._id;
			}
		}
	}
);

AuthTokenSchema.virtual('isExpired').get(function() {
	return Date.now() >= this.expires;
});

AuthTokenSchema.virtual('isActive').get(function() {
	return !this.revoked && !this.isExpired;
});

module.exports = model('AuthToken', AuthTokenSchema);
