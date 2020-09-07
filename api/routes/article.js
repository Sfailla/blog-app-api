const { Router } = require('express');
const ArticleController = require('../controllers/article');
const ArticleDbService = require('../services/article');
const ArticleModel = require('../models/article');
const UserModel = require('../models/user');
const { authenticateJWT } = require('../middleware/index');

const articleService = new ArticleDbService(ArticleModel, UserModel);
const articleController = new ArticleController(articleService);

const {
	unfavoriteArticle,
	favoriteArticle,
	getArticle,
	getArticles,
	createArticle,
	getUserArticles,
	updateArticle,
	deleteArticle
} = articleController;

const router = Router();

router.get('/', getArticles);

router.get('/:article', getArticle);

router.get('/user/articles', authenticateJWT, getUserArticles);

router.post('/', authenticateJWT, createArticle);

router.post('/:article/favorite', authenticateJWT, favoriteArticle);

router.put('/:article', authenticateJWT, updateArticle);

router.delete('/:article/favorite', authenticateJWT, unfavoriteArticle);

router.delete('/:article', authenticateJWT, deleteArticle);

module.exports = router;
