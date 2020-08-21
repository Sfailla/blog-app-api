module.exports = class ArticleController {
	constructor(databaseService) {
		this.service = databaseService;
	}

	createArticle = async (req, res, next) => {
		const { slug, title, description, body } = req.body;
		const { user_id } = req.user;

		const { article } = await this.service.create(
			user_id,
			slug,
			title,
			description,
			body
		);

		await res.status(200).json({ article });
	};

	getArticles = async (req, res, next) => {
		res.send('these will be blog posts');
	};
};
