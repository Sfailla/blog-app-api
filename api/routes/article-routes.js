const { Router } = require('express');

const ArticleController = require('../controllers/article');
const ArticleDbService = require('../services/article-service');

const ArticleModel = require('../models/article');
const UserModel = require('../models/user');

const { authenticateJWT } = require('../middleware/index');

const articleService = new ArticleDbService(ArticleModel, UserModel);
const articleController = new ArticleController(articleService);

const router = Router();

router.get('/', articleController.getArticles);

router.post('/', authenticateJWT, articleController.createArticle);

router.get(
	'/my-articles',
	authenticateJWT,
	articleController.getArticlesByUser
);

module.exports = router;
