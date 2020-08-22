const { copyArticleObj } = require('../helpers/article');
const { isValidObjId } = require('../config/index');
const { ValidationError } = require('../middleware/utils/errors');

module.exports = class ArticleDatabaseService {
	constructor(articleModel) {
		this.db = articleModel;
	}

	createArticle = async (id, title, description, body) => {
		let article = await this.db.create({
			author: id,
			title,
			description,
			body
		});
		if (!article) {
			const errMsg = 'error creating article';
			const err = new ValidationError(400, errMsg);
			return { err };
		}
		article = copyArticleObj(article);
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
		if (!articles) {
			const errMsg = 'error fetching all articles';
			const err = new ValidationError(400, errMsg);
			return { err };
		}
		const copyArticles = articles.map(article =>
			copyArticleObj(article)
		);
		return { articles: copyArticles };
	};

	getArticlesByUser = async userId => {
		if (isValidObjId(userId)) {
			let articles = await this.db.find({ author: userId });
			const copyArticles = articles.map(article =>
				copyArticleObj(article)
			);
			return { articles: copyArticles };
		}
	};

	getArticleBySlug = () => {};
};
