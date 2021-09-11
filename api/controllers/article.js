module.exports = class ArticleController {
  constructor(databaseService) {
    this.service = databaseService
  }

  createArticle = async (req, res, next) => {
    try {
      const { article, err } = await this.service.createArticle(req.user.id, req.body)
      if (err) throw err
      return await res.status(200).json({
        message: 'successfully created article',
        article
      })
    } catch (error) {
      return next(error)
    }
  }

  getArticles = async (req, res, next) => {
    try {
      const { articles, articlesCount, err } = await this.service.getAllArticles(req.user, {
        limit: req.query.limit || 10,
        offset: req.query.offset || 0,
        sortBy: req.query.sortBy || 'desc',
        tags: req.query.tags,
        author: req.query.author,
        favorites: req.query.favorites
      })
      if (err) throw err
      return await res.status(200).json({ articles, articlesCount })
    } catch (error) {
      return next(error)
    }
  }

  getUserArticles = async (req, res, next) => {
    try {
      const { articles, articlesCount, err } = await this.service.getArticlesByUser(req.user, {
        limit: req.query.limit || 5,
        offset: req.query.offset || 0,
        sortBy: req.query.sortBy || 'desc'
      })
      if (err) throw err
      return await res.status(200).json({ articles, articlesCount })
    } catch (error) {
      return next(error)
    }
  }

  getArticle = async (req, res, next) => {
    try {
      const { article, err } = await this.service.getArticleBySlug(req.user, req.params.article)
      if (err) throw err
      return await res.status(200).json({ article })
    } catch (error) {
      return next(error)
    }
  }

  favoriteArticle = async (req, res, next) => {
    try {
      const { article, err } = await this.service.setFavoriteArticle(req.user, req.params.article)
      if (err) throw err
      return await res.status(200).json({
        message: `${article.title}: marked as favorite!`,
        data: article
      })
    } catch (error) {
      return next(error)
    }
  }

  unfavoriteArticle = async (req, res, next) => {
    try {
      const { article, err } = await this.service.removeFavoriteArticle(
        req.user,
        req.params.article
      )
      if (err) throw err
      return await res.status(200).json({
        message: `${article.title}: removed from favorite!`,
        data: articles
      })
    } catch (error) {
      return next(error)
    }
  }

  updateArticle = async (req, res, next) => {
    try {
      const { article, err } = await this.service.findAndUpdateArticle(
        req.user,
        req.params.article,
        req.body
      )
      if (err) throw err
      return await res.status(200).json({
        message: `successfully updated article: ${article.title}`,
        article
      })
    } catch (error) {
      return next(error)
    }
  }

  deleteArticle = async (req, res, next) => {
    try {
      const { article, err } = await this.service.findAndDeleteArticle(req.user, req.params.article)
      if (err) throw err
      return await res.status(200).json({
        message: `successfully removed article: ${article.title}`,
        article
      })
    } catch (error) {
      next(error)
    }
  }

  createComment = async (req, res, next) => {
    try {
      const { comment, err } = await this.service.createCommentForArticle(
        req.user,
        req.params.article,
        req.body
      )
      if (err) throw err
      return await res.status(200).json({ comment })
    } catch (error) {
      next(error)
    }
  }

  getComments = async (req, res, next) => {
    try {
      const { comments, commentsCount, err } = await this.service.fetchCommentsForArticle(
        req.params.article
      )
      if (err) throw err
      return await res.status(200).json({ comments, commentsCount })
    } catch (error) {
      next(error)
    }
  }

  updateComment = async (req, res, next) => {
    try {
      const { comment, err } = await this.service.findAndUpdateComment(
        req.user,
        req.body,
        req.params.comment
      )
      if (err) throw err
      return await res.status(200).json({
        message: `successfully updated comment`,
        comment
      })
    } catch (error) {
      next(error)
    }
  }

  deleteComment = async (req, res, next) => {
    try {
      const { article, comment, err } = await this.service.removeUserComment(
        req.user,
        req.params.article,
        req.params.comment
      )
      if (err) throw err
      return await res.status(200).json({
        message: `successfully deleted comment: ${req.params.comment} `,
        article,
        comment
      })
    } catch (error) {
      next(err)
    }
  }
}
