module.exports = class ArticleController {
	constructor(databaseService) {
		this.service = databaseService;
	}

	createArticle = async (req, res, next) => {
		try {
			const { article, err } = await this.service.createArticle({
				author: req.user.id,
				title: req.body.title,
				description: req.body.description,
				body: req.body.body,
				tags: req.body.tags
			});
			if (err) throw err;
			return await res.status(200).json({
				message: 'successfully created article',
				article
			});
		} catch (error) {
			return next(error);
		}
	};

	getArticles = async (req, res, next) => {
		try {
			const {
				articles,
				articlesCount,
				err
			} = await this.service.getAllArticles({
				limit: req.query.limit || 10,
				offset: req.query.offset || 0,
				sortBy: req.query.sortBy || 'desc',
				tags: req.query.tags,
				author: req.query.author,
				favorites: req.query.favorites
			});
			if (err) throw err;
			return await res.status(200).json({ articles, articlesCount });
		} catch (error) {
			return next(error);
		}
	};

	getUserArticles = async (req, res, next) => {
		try {
			const {
				articles,
				articlesCount,
				err
			} = await this.service.getArticlesByUser(
				req.user,
				req.query.limit,
				req.query.offset
			);
			if (err) throw err;
			return await res.status(200).json({ articles, articlesCount });
		} catch (error) {
			return next(error);
		}
	};

	getArticle = async (req, res, next) => {
		try {
			const { article, err } = await this.service.getArticleBySlug(
				req.params.article
			);
			if (err) throw err;
			return await res.status(200).json({ article });
		} catch (error) {
			return next(error);
		}
	};

	favoriteArticle = async (req, res, next) => {
		try {
			const { article, err } = await this.service.setFavoriteArticle(
				req.user,
				req.params.article
			);
			if (err) throw err;
			return await res.status(200).json({
				message: `${article.title}: marked as favorite!`,
				data: article
			});
		} catch (error) {
			return next(error);
		}
	};

	unfavoriteArticle = async (req, res, next) => {
		try {
			const {
				article,
				err
			} = await this.service.removeFavoriteArticle(
				req.user,
				req.params.article
			);
			if (err) throw err;
			return await res.status(200).json({
				message: `${article.title}: removed from favorite!`,
				data: articles
			});
		} catch (error) {
			return next(error);
		}
	};

	updateArticle = async (req, res, next) => {
		try {
			const {
				article,
				err
			} = await this.service.findAndUpdateArticle(
				req.user,
				req.params.article,
				req.body
			);
			if (err) throw err;
			return await res.status(200).json({
				message: `successfully updated article: ${article.title}`,
				article
			});
		} catch (error) {
			return next(error);
		}
	};

	deleteArticle = async (req, res, next) => {
		const { article } = await this.service.findAndDeleteArticle(
			req.user,
			req.params.article
		);
		return await res.status(200).json({
			message: `successfully removed article: ${article.title}`,
			article
		});
	};
};
