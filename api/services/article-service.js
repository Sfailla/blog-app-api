module.exports = class ArticleDatabaseService {
	constructor(articleModel) {
		this.db = articleModel;
	}

	create = async (user_id, title, description, body) => {
		const article = await this.db.create({
			author: user_id,
			title,
			description,
			body
		});
		return { article };
	};

	getAllArticles = async (limit = 10, offset = 0) => {
		const query = {};
		const options = {
			sort: { updatedAt: 'desc' },
			limit: Number(limit),
			skip: offset
		};
		const articles = await this.db.find(query, null, options);

		return { articles };
	};

	getArticleByUser = () => {};

	getArticleBySlug = () => {};
};
