module.exports = class ArticleController {
	constructor(databaseService) {
		this.service = databaseService;
	}

	createArticle = async (req, res, next) => {
		const { title, description, body, tags } = req.body;
		const { id } = req.user;
		try {
			const { article, err } = await this.service.createArticle(
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
			const { articles, err } = await this.service.getAllArticles(
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

	getUserArticles = async (req, res, next) => {
		const { limit, offset } = req.query;
		console.log(id);
		try {
			const { articles, err } = await this.service.getArticlesByUser(
				req.user,
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
			const { article, err } = await this.service.getArticleBySlug(
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
			const { article } = await this.service.setFavoriteArticle(
				req.user,
				req.params.article
			);
			await res.status(200).json({ article });
		} catch (error) {
			next(error);
		}
	};

	unfavoriteArticle = async (req, res, next) => {
		try {
			const { article } = await this.service.removeFavoriteArticle(
				req.user,
				req.params.article
			);
			await res.status(200).json({ article });
		} catch (error) {
			next(error);
		}
	};
};
