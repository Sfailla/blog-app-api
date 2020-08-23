const { copyArticleObj, formatTags } = require('../helpers/article');
const { isValidObjId } = require('../config/index');
const { ValidationError } = require('../middleware/utils/errors');

module.exports = class ArticleDatabaseService {
	constructor(articleModel, userModel) {
		this.db = articleModel;
		this.user = userModel;
	}

	createArticle = async (id, title, description, body, tagList) => {
		let article = await this.db.create({
			author: id,
			title,
			description,
			body,
			tagList
		});
		if (!article) {
			const errMsg = 'error creating article';
			const err = new ValidationError(400, errMsg);
			return { err };
		}
		article = copyArticleObj(article);
		return { article };
	};

	getAllArticles = async (
		limit = 10,
		offset = 0,
		tags,
		author,
		favorited
	) => {
		const query = {};
		const options = {
			sort: { updatedAt: 'desc' },
			limit: Number(limit),
			skip: offset
		};

		if (tags) {
			query['tagList'] = { $in: formatTags(tags) };
		}

		if (author) {
			query['username'] = author;
			const user = await this.user.findOne(query);
			query['author'] = user._id;
		}

		console.log(query);

		const articles = await this.db.find(query, null, options);
		console.log(articles);

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

	getArticlesByUser = async (userId, limit = 5, offset = 0) => {
		const query = { author: userId };
		const options = {
			sort: { updatedAt: 'desc' },
			limit: Number(limit),
			skip: offset
		};
		if (isValidObjId(userId)) {
			let articles = await this.db.find(query, null, options);
			if (!articles) {
				const errMsg = 'error fetching all user articles';
				const err = new ValidationError(400, errMsg);
				return { err };
			}
			const copyArticles = articles.map(article =>
				copyArticleObj(article)
			);
			return { articles: copyArticles };
		} else {
			const errMsg = `invalid object id => ${userId}`;
			const err = new ValidationError(400, errMsg);
			return { err };
		}
	};

	getArticleBySlug = async slug => {
		const query = { slug };
		const article = await this.db.findOne(query);
		return { article };
	};
};
