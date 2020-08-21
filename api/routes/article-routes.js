const { Router } = require('express');

const ArticleController = require('../controllers/article');
const ArticleDbService = require('../services/article-service');
const ArticleModel = require('../models/article');
const { authenticateJWT } = require('../middleware/index');

const articleService = new ArticleDbService(ArticleModel);
const articleController = new ArticleController(articleService);

const router = Router();

router.get('/', articleController.getAllArticles);

router.post('/', authenticateJWT, articleController.createArticle);

module.exports = router;
