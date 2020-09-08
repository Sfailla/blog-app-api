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

const CommentSchema = new Schema(
	{
		author: { type: ObjectId, ref: 'User' },
		article: { type: ObjectId, ref: 'Article' },
		comment: { type: String, required: true, trim: true },
		updatedAt: { type: Date, default: Date.now },
		createdAt: { type: Date, default: Date.now }
	},
	{ toJSON: options }
);

module.exports = model('Comment', CommentSchema);
