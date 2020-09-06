const { isValidObjId } = require('../database/db/config');
const { ValidationError } = require('../middleware/utils/errors');
const { trimRequest } = require('../helpers/validation');

const {
	copyArticleObj,
	formatTags,
	formatFavorites,
	formatSlug
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
	createArticle = async (userId, articleFields) => {
		const article = await this.article.create({
			author: userId,
			...trimRequest(articleFields)
		});
		if (!article) {
			return this.articleError('error creating article');
		}
		return { article: await copyArticleObj(article) };
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
			if (!user) return this.articleError("sorry that author doesn't exist");
			query['author'] = user._id.toString('hex');
		}
		// query by users favorite articles
		if (filters.favorites) {
			user = await this.user.findOne({ username: filters.favorites });
			if (!user) return this.articleError("sorry that username doesn't exist");
			query['_id'] = {
				$in: formatFavorites(user.favorites)
			};
		}
		// aggregate for individual filter or all filters
		const query$Or = { $or: [ query ] };
		const articlesCount = await this.article.countDocuments();
		const articles = await this.article.find(query$Or, null, options).populate({
			path: 'author',
			model: 'User',
			select: [ 'username', 'name', 'bio', 'image' ]
		});

		if (!articles) {
			return this.articleError('error fetching all articles');
		}
		const copyArticles = articles.map(article => copyArticleObj(article));

		return {
			articles: await Promise.all(copyArticles),
			articlesCount
		};
	};
	// get all articles by logged in user
	getArticlesByUser = async (authUser, filters) => {
		const userId = authUser.id;
		const query = { author: userId };
		const options = {
			sort: { updatedAt: filters.sortBy },
			limit: Number(filters.limit),
			skip: Number(filters.offset)
		};

		if (isValidObjId(userId)) {
			const articles = await this.article.find(query, null, options).populate({
				path: 'author',
				model: 'User',
				select: [ 'username', 'name', 'bio', 'image' ]
			});
			const user = await this.user.findOne({ _id: userId });
			if (!articles || !user) {
				return this.articleError('error initializing get articles');
			}
			const articlesCount = await this.article.countDocuments();
			const copyArticles = articles.map(article => copyArticleObj(article, user));
			console.log(await Promise.all(copyArticles));
			return {
				articles: await Promise.all(copyArticles),
				articlesCount
			};
		} else {
			return this.articleError(`invalid object id => ${userId}`);
		}
	};
	// get articles by slug (title + unique id)
	getArticleBySlug = async slug => {
		const query = { slug };
		const article = await this.article.findOne({ ...query }).populate({
			path: 'author',
			model: 'User',
			select: [ 'username', 'name', 'bio', 'image' ]
		});
		if (!article) {
			return this.articleError('error fetching article slug');
		}
		return { article: await copyArticleObj(article) };
	};
	// set favorite articles
	setFavoriteArticle = async (authUser, slug) => {
		const articleSchema = await this.article.findOne({ slug });
		const userSchema = await this.user.findOne({ _id: authUser.id });
		if (!articleSchema || !userSchema) {
			return this.articleError('error initializing favorite article');
		}
		const user = await userSchema.favorite(articleSchema._id);
		const article = await articleSchema.updateCount('inc');
		if (!user || !article) {
			return this.articleError('error setting favorite article');
		}
		return { article: await copyArticleObj(article, user) };
	};
	// remove favorite article
	removeFavoriteArticle = async (authUser, slug) => {
		const articleSchema = await this.article.findOne({ slug });
		const userSchema = await this.user.findById(authUser.id);
		if (!articleSchema || !userSchema) {
			return this.articleError('err initializing unfavorite article');
		}

		const user = await userSchema.unfavorite(articleSchema._id);
		const article = await articleSchema.updateCount();
		if (!user || !article) {
			return this.articleError('error setting unfavorite article');
		}
		return { article: await copyArticleObj(article, user) };
	};
	// update user article
	findAndUpdateArticle = async (authUser, slug, updates) => {
		let article = await this.article
			.findOneAndUpdate(
				{ author: authUser.id, slug },
				{
					...trimRequest(updates),
					slug: formatSlug(trimRequest(updates.title)),
					updatedAt: Date.now()
				},
				{ new: true }
			)
			.populate({
				path: 'author',
				model: 'User',
				select: [ 'username', 'name', 'bio', 'image' ]
			});
		if (!article) {
			return this.articleError('error updating article');
		}
		return { article: await copyArticleObj(article) };
	};
	// remove user article
	findAndDeleteArticle = async (authUser, slug) => {
		const article = await this.article.findOneAndDelete({
			author: authUser.id,
			slug
		});
		if (!article) {
			const errMsg = 'error deleting article';
			const err = new ValidationError(400, errMsg);
			return { err };
		}
		return { article: await copyArticleObj(article) };
	};
};
