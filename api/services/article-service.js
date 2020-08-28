const { isValidObjId } = require('../config/index');
const { ValidationError } = require('../middleware/utils/errors');
const {
	copyArticleObj,
	formatTags,
	formatFavorites
} = require('../helpers/article');

module.exports = class ArticleDatabaseService {
	constructor(articleModel, userModel) {
		this.article = articleModel;
		this.user = userModel;
	}
	// article error method to keep class DRY
	articleError = errMsg => {
		return { err: new ValidationError(400, errMsg) };
	};
	// create article
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
	// get all articles with filters
	getAllArticles = async (limit = 10, offset = 0, sortBy = 'desc', tags, author, favorites) => {
		let query = {};
		const options = {
			sort: { updatedAt: sortBy },
			limit: Number(limit),
			skip: Number(offset)
		};
		// query by tags
		if (tags) {
			query['tags'] = { $in: formatTags(tags) };
		}
		// query by author
		if (author) {
			const user = await this.user.findOne({ username: author });
			if (!user) return this.articleError('sorry that author doesn\'t exist');
			query['author'] = user._id.toString('hex');
		}
		// query by users favorite articles
		if (favorites) {
			const user = await this.user.findOne({ username: favorites });
			if (!user) return this.articleError('sorry that name doesn\'t exist');
			query['_id'] = {
				$in: formatFavorites(user.favorites)
			};
		}
		// query for individual filter or all filters
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
	// get all articles by logged in user
	getArticlesByUser = async (userObj, limit = 5, offset = 0) => {
		const userId = userObj.id;
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
				copyArticleObj(article, userObj)
			);
			return { articles: copyArticles };
		} else {
			const errMsg = `invalid object id => ${userId}`;
			return { err: new ValidationError(400, errMsg) };
		}
	};
	// get articles by slug (title + unique id)
	getArticleBySlug = async slug => {
		const query = { slug };
		const article = await this.article.findOne(query);
		if (!article) {
			return this.articleError('error fetching article slug');
		}
		return { article: copyArticleObj(article) };
	};
	// set favorite articles
	setFavoriteArticle = async (userObj, slug) => {
		const articleSchema = await this.article.findOne({ slug });
		const userSchema = await this.user.findOne({ _id: userObj.id });
		if (!articleSchema || !userSchema) {
			return this.articleError('error initializing favorite article');
		}
		const user = await userSchema.favorite(articleSchema._id);
		const article = await articleSchema.updateCount('inc');
		if (!user || !article) {
			return this.articleError('error setting favorite article');
		}
		return { article: copyArticleObj(article, user) };
	};
	// remove favorite article
	removeFavoriteArticle = async (userObj, slug) => {
		const articleSchema = await this.article.findOne({ slug });
		const userSchema = await this.user.findById(userObj.id);
		if (!articleSchema || !userSchema) {
			return this.articleError('err initializing unfavorite article');
		}

		const user = await userSchema.unfavorite(articleSchema._id);
		const article = await articleSchema.updateCount();
		if (!user || !article) {
			return this.articleError('error setting unfavorite article');
		}
		return { article: copyArticleObj(article, user) };
	};
};
