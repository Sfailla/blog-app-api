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
	createArticle = async articleFields => {
		const article = await this.article.create({ ...articleFields });
		if (!article) {
			return this.articleError('error creating article');
		}
		return { article: copyArticleObj(article) };
	};
	// get all articles with filters
	getAllArticles = async filters => {
		let user;
		let query = {};
		const options = {
			sort: { updatedAt: filters.sortBy },
			limit: Number(filters.limit),
			skip: Number(filters.offset)
		};
		// query by tags
		if (filters.tags) {
			query['tags'] = { $in: formatTags(filters.tags) };
		}
		// query by author
		if (filters.author) {
			user = await this.user.findOne({ username: filters.author });
			if (!user)
				return this.articleError("sorry that author doesn't exist");
			query['author'] = user._id.toString('hex');
		}
		// query by users favorite articles
		if (filters.favorites) {
			user = await this.user.findOne({ username: filters.favorites });
			if (!user)
				return this.articleError("sorry that name doesn't exist");
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
			return copyArticleObj(article, user);
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
			skip: Number(offset)
		};

		if (isValidObjId(userId.toString('hex'))) {
			const articles = await this.article
				.find(query, null, options)
				.populate('author', 'username name bio image');
			if (!articles) {
				return this.articleError('error fetching user articles');
			}
			const copyArticles = articles.map(article =>
				copyArticleObj(article)
			);
			return { articles: copyArticles };
		} else {
			return this.articleError(`invalid object id => ${userId}`);
		}
	};
	// get articles by slug (title + unique id)
	getArticleBySlug = async slug => {
		const query = { slug };
		const article = await this.article
			.findOne(query)
			.populate('author', 'username name bio image');
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
