module.exports = class ArticleController {
	constructor(databaseService) {
		this.db = databaseService;
	}

	createArticle = async (req, res, next) => {
		const { title, description, body, tags } = req.body;
		const { id } = req.user;
		try {
			const { article, err } = await this.db.createArticle(
				id,
				title,
				description,
				body,
				tags
			);
			if (err) throw err;
			await res.status(200).json({ article });
		} catch (error) {
			next(error);
		}
	};

	getArticles = async (req, res, next) => {
		const { limit, offset, tags, author, favorite } = req.query;
		try {
			const { articles, err } = await this.db.getAllArticles(
				limit,
				offset,
				tags,
				author,
				favorite
			);
			if (err) throw err;
			await res.status(200).json({ articles });
		} catch (error) {
			next(error);
		}
	};

	getUserArticle = async (req, res, next) => {
		const { id } = req.user;
		const { limit, offset } = req.query;
		try {
			const { articles, err } = await this.db.getArticlesByUser(
				id,
				limit,
				offset
			);
			if (err) throw err;
			await res.status(200).json({ articles });
		} catch (error) {
			next(error);
		}
	};

	getArticle = async (req, res, next) => {
		try {
			const { article, err } = await this.db.getArticleBySlug(
				req.params.article
			);
			if (err) throw err;
			await res.status(200).json({ article });
		} catch (error) {
			next(error);
		}
	};

	favoriteArticle = async (req, res, next) => {
		try {
			const { article } = await this.db.setFavoriteArticle(
				req.user,
				req.params.article
			);
			await res.status(200).json({ article });
		} catch (error) {
			next(error);
		}
	};

	unfavoriteArticle = async (req, res, next) => {};
};
