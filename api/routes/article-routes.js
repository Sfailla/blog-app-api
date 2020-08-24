const { Router } = require('express');

const ArticleController = require('../controllers/article');
const ArticleDbService = require('../services/article-service');

const ArticleModel = require('../models/article');
const UserModel = require('../models/user');

const { authenticateJWT } = require('../middleware/index');

const articleService = new ArticleDbService(ArticleModel, UserModel);
const articleController = new ArticleController(articleService);

const router = Router();

router.post('/', authenticateJWT, articleController.createArticle);

router.post(
	'/:slug/favorite',
	authenticateJWT,
	articleController.setFavoriteArticle
);

router.get('/', articleController.getArticles);

router.get(
	'/my-articles',
	authenticateJWT,
	articleController.getArticlesByUser
);

router.get('/:slug', articleController.getArticleBySlug);

module.exports = router;
