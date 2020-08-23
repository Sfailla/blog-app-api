const copyArticleObj = article => {
	const {	id, author, slug,	title, description,	body,	comments,	tagList,	isFavorite,	favoriteCount,	updatedAt, createdAt } = article;
  return { id,	author,	slug,	title,	description,	body,	comments,	tagList,	isFavorite,	favoriteCount,	updatedAt,	createdAt
  }
};

const formatTags = (tags) => {
  return tags.split(',').map(tag => tag.toLowerCase());
}

const slugify = (slug) => {
  return slug.toLowerCase().split(' ').join('-');
}

module.exports = {
  copyArticleObj,
  formatTags,
  slugify
};
