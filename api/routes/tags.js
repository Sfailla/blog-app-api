const express = require('express');
const ArticleModel = require('../models/article');
const TagsController = require('../controllers/tags');

const tagsController = new TagsController(ArticleModel);

const router = express.Router();

const { getAllTags } = tagsController;

router.get('/', getAllTags);

module.exports = router;
