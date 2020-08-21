module.exports = class ArticleController {
	constructor(databaseService) {
		this.service = databaseService;
	}

	createArticle = async (req, res, next) => {
		const { title, description, body } = req.body;
		const { user_id } = req.user;

		const { article } = await this.service.create(
			user_id,
			title,
			description,
			body
		);

		await res.status(200).json({ article });
	};

	getAllArticles = async (req, res, next) => {
		console.log(req.query);
		const { limit, offset } = req.query;
		const { articles } = await this.service.getAllArticles(
			limit,
			offset
		);

		res.status(200).json({ articles });
	};
};
