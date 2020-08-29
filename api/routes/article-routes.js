const { Router } = require('express');
const ArticleController = require('../controllers/article');
const ArticleDbService = require('../services/article-service');
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
	updateArticle
} = articleController;

const router = Router();

router.post('/', authenticateJWT, createArticle);

router.post('/:article/favorite', authenticateJWT, favoriteArticle);

router.delete(
	'/:article/favorite',
	authenticateJWT,
	unfavoriteArticle
);

router.get('/', getArticles);

router.get('/:article', getArticle);

router.get('/user/articles', authenticateJWT, getUserArticles);

router.put('/:article', authenticateJWT, updateArticle);

module.exports = router;
