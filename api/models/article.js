const mongoose = require('mongoose');
const { Schema, Types, model } = mongoose;
const { ObjectId } = Types;

const requiredString = {
	type: String,
	required: true
};

const options = {
	virtuals: true,
	versionKey: false,
	transform: (doc, ret) => {
		delete ret._id;
	}
};

const ArticleSchema = new Schema(
	{
		author: {
			type: ObjectId,
			ref: 'User'
		},
		slug: {
			...requiredString,
			trim: true,
			unique: true,
			set: value => value.toLowerCase(),
			default: function slugify() {
				return this.title.split(' ').join('-');
			}
		},
		title: {
			...requiredString,
			unique: true
		},
		description: {
			...requiredString
		},
		body: {
			...requiredString
		},
		comments: [
			{
				type: ObjectId,
				ref: 'Comment'
			}
		],
		tagList: {
			type: Array,
			default: []
		},
		isFavorite: {
			type: Boolean,
			default: false
		},
		favoriteCount: {
			type: Number,
			default: 0
		},
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now }
	},
	{ toJSON: options }
);

module.exports = model('Article', ArticleSchema);
