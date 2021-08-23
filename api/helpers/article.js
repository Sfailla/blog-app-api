const { randomBytes } = require('crypto')

/**
 * ===============================
 * ==  PUBLIC HELPER FUNCTIONS  ==
 * ===============================
 */

const makeArticleObj = async (article, profile) => {
  return {
    id: article._id,
    author: article.author,
    slug: article.slug,
    title: article.title,
    description: article.description,
    body: article.body,
    image: article.image,
    tags: article.tags,
    isFavorite: profile ? await profile.isFavorite(article._id) : false,
    favoriteCount: article.favoriteCount,
    updatedAt: article.updatedAt,
    createdAt: article.createdAt
  }
}

const makeCommentObj = comments => {
  const { id, comment, author, article, updatedAt, createdAt } = comments
  return { id, comment, author, article, updatedAt, createdAt }
}

const formatTags = tags => {
  return tags.split(',').map(tag => tag.toLowerCase())
}

const formatFavorites = favorites => {
  return favorites.map(favorite => favorite.toString('hex'))
}

const formatSlug = slug => {
  return `${slug.toLowerCase().split(' ').join('-')}-${randomBytes(4).toString('hex')}`
}

module.exports = {
  makeArticleObj,
  makeCommentObj,
  formatSlug,
  formatTags,
  formatFavorites
}
