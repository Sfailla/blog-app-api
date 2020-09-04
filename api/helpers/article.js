const { randomBytes } = require('crypto');

/**
 * ===============================
 * ==  PUBLIC HELPER FUNCTIONS  ==
 * ===============================
 */

const copyArticleObj = async (article, authUser) => {
	return {
		id: article._id,
		author: article.author,
		slug: article.slug,
		title: article.title,
		description: article.description,
		body: article.body,
		comments: article.comments,
		tags: article.tags,
		isFavorite: authUser ? await authUser.isFavorite(article._id) : null,
		favoriteCount: article.favoriteCount,
		updatedAt: article.updatedAt,
		createdAt: article.createdAt
	};
};

const formatTags = tags => {
	return tags.split(',').map(tag => tag.toLowerCase());
};

const formatFavorites = favorites => {
	return favorites.map(favorite => favorite.toString('hex'));
};

const formatSlug = slug => {
	return `${slug.toLowerCase().split(' ').join('-')}-${randomBytes(4).toString(
		'hex'
	)}`;
};

module.exports = {
	copyArticleObj,
	formatSlug,
	formatTags,
	formatFavorites
};
