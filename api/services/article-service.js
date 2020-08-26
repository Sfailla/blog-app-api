const { copyArticleObj, formatTags } = require('../helpers/article');
const { isValidObjId } = require('../config/index');
const { ValidationError } = require('../middleware/utils/errors');

module.exports = class ArticleDatabaseService {
	constructor(articleModel, userModel) {
		this.article = articleModel;
		this.user = userModel;
	}

	articleError = errMsg => {
		const err = new ValidationError(400, errMsg);
		return { err };
	};

	createArticle = async (id, title, description, body, tags) => {
		const article = await this.article.create({
			author: id,
			title,
			description,
			body,
			tags
		});
		if (!article) {
			return this.articleError('error creating article');
		}
		return { article: copyArticleObj(article) };
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
		const query$Or = { $or: [ query ] };

		const articles = await this.article
			.find(query$Or, null, options)
			.populate('author', 'username name bio image');

		if (!articles) {
			return this.articleError('error fetching all articles');
		}
		const copyArticles = articles.map(article => {
			return copyArticleObj(article);
		});
		return { articles: copyArticles };
	};

	getArticlesByUser = async (userId, limit = 5, offset = 0) => {
		console.log('hit route user');
		const query = { author: userId };
		const options = {
			sort: { updatedAt: 'desc' },
			limit: Number(limit),
			skip: offset
		};
		if (isValidObjId(userId)) {
			const articles = await this.article.find(query, null, options);
			if (!articles) {
				return this.articleError('error fetching all user articles');
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
		if (!article) {
			return this.articleError('error fetching article by slug');
		}
		return { article: copyArticleObj(article) };
	};

	setFavoriteArticle = async (user, slug) => {
		const articleQuery = { slug };
		const initialArticle = await this.article.findOne(articleQuery);
		let article = copyArticleObj(initialArticle);

		if (!article) {
			return this.articleError(
				'error fetching initial article for favorite'
			);
		}

		if (initialArticle.isFavorite === false) {
			const update = { $inc: { favoriteCount: +1 } };
			article = await this.article.findOneAndUpdate(
				articleQuery,
				update,
				{ new: true }
			);
		}
		console.log(user.favorites.indexOf(article.id) === -1);
		console.log(article);

		if (user.favorites.indexOf(article.id) === -1) {
			const userQuery = { _id: user.id };
			const updateUser = {
				$push: { favorites: article.id }
			};
			await this.user.findOneAndUpdate(userQuery, updateUser, {
				new: true
			});

			return { article: copyArticleObj(article) };
		}

		return { article };
	};

	unsetFavoriteArticle = async (user, slug) => {
		const articleQuery = { slug };
		const initialArticle = await this.article.findOne(articleQuery);

		let article = copyArticleObj(initialArticle);

		const articleOptionsDec = {
			$set: { isFavorite: false },
			$inc: { favoriteCount: -1 }
		};

		if (initialArticle.isFavorite === false) {
			article = await this.article.findOneAndUpdate(
				articleQuery,
				articleOptionsInc,
				{ new: true }
			);
		}

		if (user.favorites.indexOf(article._id) === -1) {
			const userQuery = { _id: article.author };
			const update = {
				$push: { favorites: article._id }
			};
			await this.user.findOneAndUpdate(userQuery, update, {
				new: true
			});

			return { article };
		}

		return { article };
	};
};
