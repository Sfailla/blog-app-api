const mongoose = require('mongoose');
const { slugify } = require('../helpers/article');
const { Schema, Types, model } = mongoose;
const { ObjectId } = Types;

const requiredString = { type: String, required: true };
const typeProps = { trim: true, unique: true, index: true };

const options = {
	virtuals: true,
	versionKey: false,
	transform: (_, ret) => {
		delete ret._id;
	}
};

const ArticleSchema = new Schema(
	{
		slug: {
			...requiredString,
			...typeProps,
			default: function() {
				return slugify(this.title);
			}
		},
		author: { type: ObjectId, ref: 'User' },
		title: { ...requiredString, unique: true, index: true },
		description: { ...requiredString },
		body: { ...requiredString },
		articleImg: { type: String, defualt: null },
		comments: [ { type: ObjectId, ref: 'Comment' } ],
		tagList: [ { type: String, lowercase: true, default: [] } ],
		isFavorite: { type: Boolean, default: false },
		favoriteCount: { type: Number, default: 0 },
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now }
	},
	{ toJSON: options, versionKey: false }
);

module.exports = model('Article', ArticleSchema);
