const mongoose = require('mongoose');
const { Schema, Types, model } = mongoose;
const { ObjectId } = Types;

const CommentSchema = new Schema({
	author: { type: ObjectId, ref: 'User' },
	article: { type: ObjectId, ref: 'Article' },
	comment: { type: String },
	updatedAt: { type: Date, default: Date.now },
	createdAt: { type: Date, default: Date.now }
});

module.exports = model('Comment', CommentSchema);
