const mongoose = require('mongoose');
const { Schema, Types, model } = mongoose;
const { ObjectId } = Types;

const requiredString = {
	type: String,
	required: true
};

const ArticleSchema = new Schema({
	author: {
		type: ObjectId,
		ref: 'User'
	},
	slug: {
		...requiredString,
		set: value => value.toLowerCase()
	},
	title: {
		...requiredString
	},
	description: {
		...requiredString
	},
	body: {
		...requiredString
	},
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
});

const Article = model('Article', ArticleSchema);

module.exports = Article;
