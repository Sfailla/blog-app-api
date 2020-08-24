const { copyArticleObj, formatTags } = require('../helpers/article');
const { isValidObjId } = require('../config/index');
const { ValidationError } = require('../middleware/utils/errors');

module.exports = class ArticleDatabaseService {
	constructor(articleModel, userModel) {
		this.article = articleModel;
		this.user = userModel;
	}

	createArticle = async (id, title, description, body, tags) => {
		let article = await this.article.create({
			author: id,
			title,
			description,
			body,
			tags
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
		favorite
	) => {
		let query = {};
		const options = {
			sort: { updatedAt: 'desc' },
			limit: Number(limit),
			skip: Number(offset)
		};
		// query for tags only
		if (tags) {
			query['tags'] = { $in: formatTags(tags) };
		}
		// query for author only
		if (author) {
			const user = await this.user.findOne({ username: author });
			query['author'] = user._id.toString('hex');
		}
		// query for author and tags using $or
		const queryOr = { $or: [ query ] };

		const articles = await this.article
			.find(queryOr, null, options)
			.populate('author', 'username name bio image');

		if (!articles) {
			const errMsg = 'error fetching all articles';
			const err = new ValidationError(400, errMsg);
			return { err };
		}
		const copyArticles = articles.map(article => {
			return copyArticleObj(article);
		});
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
			let articles = await this.article.find(query, null, options);
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
		const article = await this.article.findOne(query);
		return { article };
	};

	setFavoriteArticle = async (user, slug) => {
		const articleQuery = { slug };
		const articleOptions = {
			$set: { isFavorite: true },
			$inc: { favoriteCount: +1 }
		};
		const article = await this.article.findOneAndUpdate(
			articleQuery,
			articleOptions,
			{ new: true }
		);

		// if (article.author.indexOf('')) {
		// }
		const userQuery = { _id: article.author };
		const update = { $push: { favorites: article.author } };
		const updatedUser = await this.user.findOneAndUpdate(
			userQuery,
			update,
			{ new: true }
		);

		console.log(updatedUser);

		return { article };
	};
};
