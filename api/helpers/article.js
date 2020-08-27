const { randomBytes } = require('crypto');

/**
 * ===============================
 * ==  PUBLIC HELPER FUNCTIONS  ==
 * ===============================
 */

const copyArticleObj = (article, authUser = null) => {
	return {
		id: article._id,
		author: article.author,
		slug: article.slug,
		title: article.title,
		description: article.description,
		body: article.body,
		comments: article.comments,
		tags: article.tags,
		isFavorite: authUser ? authUser.isFavorite(article._id) : null,
		favoriteCount: article.favoriteCount,
		updatedAt: article.updatedAt,
		createdAt: article.createdAt
	};
};

const formatTags = tags => {
	return tags.split(',').map(tag => tag.toLowerCase());
};

const slugify = slug => {
	return `${slug.toLowerCase().split(' ').join('-')}-${randomBytes(
		4
	).toString('hex')}`;
};

module.exports = {
	copyArticleObj,
	formatTags,
	slugify
};
