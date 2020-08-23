module.exports = class ArticleController {
	constructor(databaseService) {
		this.service = databaseService;
	}

	createArticle = async (req, res, next) => {
		const { title, description, body, tagList } = req.body;
		const { id } = req.user;
		try {
			const { article, err } = await this.service.createArticle(
				id,
				title,
				description,
				body,
				tagList
			);
			if (err) throw err;
			await res.status(200).json({ article });
		} catch (error) {
			next(error);
		}
	};

	getArticles = async (req, res, next) => {
		const { limit, offset, tags, author, favorited } = req.query;
		try {
			const { articles, err } = await this.service.getAllArticles(
				limit,
				offset,
				tags,
				author,
				favorited
			);
			if (err) throw err;
			res.status(200).json({ articles });
		} catch (error) {
			next(error);
		}
	};

	getArticlesByUser = async (req, res, next) => {
		const { limit, offset } = req.query;
		const { id } = req.user;
		try {
			const { articles, err } = await this.service.getArticlesByUser(
				id,
				limit,
				offset
			);
			if (err) throw err;
			res.status(200).json({ articles });
		} catch (error) {
			next(err);
		}
	};

	getArticleBySlug = async (req, res, next) => {
		const { slug } = req.body;
		const { article } = await this.service.getArticleBySlug(slug);
		res.status(200).json({ article });
	};
};
