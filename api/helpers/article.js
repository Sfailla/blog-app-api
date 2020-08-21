const copyArticleObj = article => {
	const {	id, author, slug,	title, description,	body,	comments,	tagList,	isFavorite,	favoriteCount,	updatedAt, createdAt } = article;
  return { id,	author,	slug,	title,	description,	body,	comments,	tagList,	isFavorite,	favoriteCount,	updatedAt,	createdAt
  }
};

module.exports = {
	copyArticleObj
};