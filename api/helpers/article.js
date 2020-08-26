const { randomBytes } = require('crypto');

const copyArticleObj = article => {
	const {	id, author, slug,	title, description,	body,	comments,	tags,	isFavorite = false,	favoriteCount,	updatedAt, createdAt } = article;
  return { id,	author,	slug,	title,	description,	body,	comments,	tags,	isFavorite,	favoriteCount,	updatedAt,	createdAt
  }
};

const formatTags = tags => {
  return tags.split(',').map(tag => tag.toLowerCase());
}

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
