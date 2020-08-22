const { Router } = require('express');

const ArticleController = require('../controllers/article');
const ArticleDbService = require('../services/article-service');
const ArticleModel = require('../models/article');

const { ValidationError } = require('../middleware/utils/errors');
const { authenticateJWT } = require('../middleware/index');

const articleService = new ArticleDbService(ArticleModel);
const articleController = new ArticleController(
	articleService,
	ValidationError
);

const router = Router();

router.get('/', articleController.getAllArticles);

router.post('/', authenticateJWT, articleController.createArticle);

router.get(
	'/my-articles',
	authenticateJWT,
	articleController.getArticlesByUser
);

module.exports = router;
