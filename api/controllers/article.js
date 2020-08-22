module.exports = class ArticleController {
	constructor(databaseService, validationError) {
		this.service = databaseService;
		this.articleError = (statusCode, message) => {
			return new validationError(statusCode, message);
		};
	}

	createArticle = async (req, res, next) => {
		const { title, description, body } = req.body;
		const { id } = req.user;
		try {
			const { article, err } = await this.service.createArticle(
				id,
				title,
				description,
				body
			);
			if (err) throw err;
			await res.status(200).json({ article });
		} catch (error) {
			next(error);
		}
	};

	getAllArticles = async (req, res, next) => {
		const { limit, offset } = req.query;
		const { articles } = await this.service.getAllArticles(
			limit,
			offset
		);
		res.status(200).json({ articles });
	};

	getArticlesByUser = async (req, res, next) => {
		const { id } = req.user;
		const { articles } = await this.service.getArticlesByUser(id);
		res.status(200).json({ articles });
	};
};
