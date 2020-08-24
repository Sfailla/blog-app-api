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

	getArticlesByUser = async (req, res, next) => {
		const { limit, offset } = req.query;
		const { id } = req.user;
		try {
			const { articles, err } = await this.db.getArticlesByUser(
				id,
				limit,
				offset,
				slug
			);
			if (err) throw err;
			await res.status(200).json({ articles });
		} catch (error) {
			next(err);
		}
	};

	getArticleBySlug = async (req, res, next) => {
		const { slug } = req.params;
		const { article } = await this.db.getArticleBySlug(slug);
		await res.status(200).json({ article });
	};

	setFavoriteArticle = async (req, res, next) => {
		const { slug } = req.params;
		const user = req.user;
		const { article } = await this.db.setFavoriteArticle(user, slug);
		await res.status(200).json({ article });
	};
};
