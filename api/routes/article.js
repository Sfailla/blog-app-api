const { Router } = require('express')
const { authenticateJWT, requiredRole } = require('../middleware/index')

const ArticleController = require('../controllers/article')
const ArticleDbService = require('../services/article')
const ArticleModel = require('../models/article')
const UserModel = require('../models/user')
const ProfileModel = require('../models/profile')
const CommentModel = require('../models/comment')

const articleService = new ArticleDbService(ArticleModel, UserModel, ProfileModel, CommentModel)
const articleController = new ArticleController(articleService)

const {
  unfavoriteArticle,
  favoriteArticle,
  getArticle,
  getArticles,
  getComments,
  createArticle,
  getUserArticles,
  updateArticle,
  deleteArticle,
  createComment,
  updateComment,
  deleteComment
} = articleController

const router = Router()

router.get('/', requiredRole('user'), getArticles)

router.get('/:article', getArticle)

router.get('/user/article', authenticateJWT, getUserArticles)

router.get('/:article/comment', getComments)

router.post('/', authenticateJWT, createArticle)

router.post('/:article/favorite', authenticateJWT, favoriteArticle)

router.post('/:article/comment', authenticateJWT, createComment)

router.put('/:article', authenticateJWT, updateArticle)

router.put('/:article/comment/:comment', authenticateJWT, updateComment)

router.delete('/:article/favorite', authenticateJWT, unfavoriteArticle)

router.delete('/:article', authenticateJWT, deleteArticle)

router.delete('/:article/comment/:comment', authenticateJWT, deleteComment)

module.exports = router
