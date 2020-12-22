const { isValidObjId } = require('../database/db/index');
const { ValidationError } = require('../middleware/utils/errors');
const { trimRequest } = require('../helpers/validation');

const {
  makeArticleObj,
  formatTags,
  formatFavorites,
  formatSlug,
  makeCommentObj,
} = require('../helpers/article');

module.exports = class ArticleDatabaseService {
  constructor(articleModel, userModel, profileModel, commentModel) {
    this.article = articleModel;
    this.user = userModel;
    this.profile = profileModel;
    this.comment = commentModel;
  }

  // article error method to keep class DRY
  articleError = errMsg => {
    return { err: new ValidationError(400, errMsg) };
  };

  // create article
  createArticle = async (userId, articleFields) => {
    const profile = await this.profile.findOne({ user: userId });
    const article = await this.article.create({
      author: profile._id,
      ...trimRequest(articleFields),
    });
    if (!article) {
      return this.articleError('error creating article');
    }
    return { article: await makeArticleObj(article) };
  };

  // get all articles with filters
  getAllArticles = async filters => {
    let profile;
    let query = {};
    const options = {
      sort: { updatedAt: filters.sortBy },
      limit: Number(filters.limit),
      skip: Number(filters.offset),
    };
    // query by tags
    if (filters.tags) {
      query['tags'] = { $in: formatTags(filters.tags) };
    }
    // query by author
    if (filters.author) {
      profile = await this.profile.findOne({ username: filters.author });
      if (!profile) return this.articleError("sorry that author doesn't exist");
      query['author'] = profile._id.toString();
    }
    // query by users favorite articles
    if (filters.favorites) {
      profile = await this.profile.findOne({ username: filters.favorites });
      if (!profile) return this.articleError("sorry that username doesn't exist");
      query['_id'] = {
        $in: formatFavorites(profile.favorites),
      };
    }
    // aggregate for individual filter or all filters
    const query$Or = { $or: [query] };
    const articles = await this.article.find(query$Or, null, options).populate({
      path: 'author',
      model: 'Profile',
      select: ['username', 'name', 'bio', 'image'],
    });

    if (!articles) {
      return this.articleError('error fetching all articles');
    }
    const copyArticles = articles.map(article => makeArticleObj(article));

    return {
      articles: await Promise.all(copyArticles),
      articlesCount: copyArticles.length,
    };
  };

  // get all articles by logged in user
  getArticlesByUser = async (authUser, filters) => {
    const userId = authUser.id;
    const profile = await this.profile.findOne({ user: userId });
    const query = { author: profile._id };
    const options = {
      sort: { updatedAt: filters.sortBy },
      limit: Number(filters.limit),
      skip: Number(filters.offset),
    };

    if (isValidObjId(userId)) {
      const articles = await this.article.find(query, null, options).populate({
        path: 'author',
        model: 'Profile',
        select: ['username', 'name', 'bio', 'image'],
      });
      // .populate({
      // 	path: 'comments',
      // 	model: 'Comment',
      // 	populate: {
      // 		path: 'author',
      // 		model: 'Profile'
      // 	}
      // });

      if (!articles || !profile) {
        return this.articleError('error initializing get articles');
      }

      // const articlesCount = await this.article.countDocuments();
      const copyArticles = articles.map(article => makeArticleObj(article, profile));
      return {
        articles: await Promise.all(copyArticles),
        articlesCount: copyArticles.length,
      };
    } else {
      return this.articleError(`invalid object id => ${userId}`);
    }
  };

  // get articles by slug
  getArticleBySlug = async slug => {
    const query = { slug };
    const article = await this.article.findOne({ ...query }).populate({
      path: 'author',
      model: 'User',
      select: ['username', 'name', 'bio', 'image'],
    });
    if (!article) {
      return this.articleError('error fetching article slug');
    }
    return { article: await makeArticleObj(article) };
  };
  // set favorite articles
  setFavoriteArticle = async (authUser, slug) => {
    const articleSchema = await this.article.findOne({ slug });

    if (!articleSchema) {
      return this.articleError(
        "error retrieving article. it's possible that the wrong article was entered"
      );
    }

    const getProfile = await this.profile.findOne({ user: authUser.id });

    if (!getProfile) {
      return this.articleError('error initializing favorite article');
    }

    const profile = await getProfile.favorite(articleSchema._id);
    const article = await articleSchema.updateCount('inc');

    return { article: await makeArticleObj(article, profile) };
  };

  // remove favorite article
  removeFavoriteArticle = async (authUser, slug) => {
    const articleSchema = await this.article.findOne({ slug });

    if (!articleSchema) {
      return this.articleError(
        "error retrieving article. it's possible that the wrong article was entered"
      );
    }

    const getProfile = await this.profile.findOne({ user: authUser.id });

    if (!getProfile) {
      return this.articleError('err initializing unfavorite article');
    }

    const profile = await getProfile.unfavorite(articleSchema._id);
    const article = await articleSchema.updateCount();

    return {
      article: await makeArticleObj(article, profile),
      message: `article ${article.title} was removed from favorites`,
    };
  };

  // update user article
  findAndUpdateArticle = async (authUser, slug, updates) => {
    const query = { author: authUser.id, slug };
    const update = {
      ...trimRequest(updates),
      slug: formatSlug(trimRequest(updates.title)),
      updatedAt: Date.now(),
    };
    let article = await this.article
      .findOneAndUpdate(query, update, { new: true })
      .populate({
        path: 'author',
        model: 'User',
        select: ['username', 'name', 'bio', 'image'],
      });
    if (!article) {
      return this.articleError('error updating article');
    }
    return {
      article: await makeArticleObj(article),
      message: 'successfully updated article',
    };
  };

  // remove user article
  findAndDeleteArticle = async (authUser, slug) => {
    const article = await this.article.findOneAndDelete({
      author: authUser.id,
      slug,
    });
    if (!article) {
      return this.articleError('error deleting article');
    }
    return {
      article: await makeArticleObj(article),
      message: `deleted article: ${article.title}`,
    };
  };

  createCommentForArticle = async (authUser, articleSlug, commentFields) => {
    const profile = await this.profile.findOne({ user: authUser.id });

    if (!profile) {
      this.articleError('error initializing create comment');
    }

    const article = await this.article.findOne({ slug: articleSlug });
    const createComment = {
      ...commentFields,
      article: article._id,
      author: profile._id,
    };

    if (!article) {
      this.articleError('error initializing create comment');
    }

    const comment = await this.comment.create({ ...createComment });

    if (!comment) return this.articleError('error creating comment');
    await article.addComment(article._id, comment);

    return {
      comment: makeCommentObj(comment),
      message: 'successfully created comment!',
    };
  };

  fetchCommentsForArticle = async articleSlug => {
    const article = await this.article.findOne({ slug: articleSlug });

    if (!article) {
      return this.articleError(
        "error fetching article. It's possible that you accidentally entered the wrong article name"
      );
    }

    const getComments = await this.comment.find({ article: article._id }).populate({
      path: 'author',
      model: 'Profile',
      select: ['username', 'name', 'bio', 'image'],
    });

    if (!getComments) {
      return this.articleError(`error fetching comments for ${article.title}`);
    }

    const comments = getComments.map(comment => makeCommentObj(comment));
    const commentsCount = comments.length;

    return {
      comments,
      commentsCount,
    };
  };

  findAndUpdateComment = async (authUser, updateField, commentId) => {
    const query = { _id: commentId, author: authUser.id };
    const updates = {
      ...trimRequest(updateField),
      updatedAt: Date.now(),
    };
    const comment = await this.comment.findOneAndUpdate(query, updates, {
      new: true,
    });

    if (!comment) {
      return this.articleError('error updating comment');
    }
    return {
      comment,
      message: 'successfully updated comment',
    };
  };

  removeUserComment = async (authUser, articleSlug, commentId) => {
    const article = await this.article.findOne({ slug: articleSlug });
    const comment = await this.comment.findOne({ _id: commentId });

    if (!article || !comment) {
      return this.articleError('error initializing delete comment');
    }
    const updatedArticle = await article.deleteComment(commentId);
    await comment.deleteComment(authUser.id, commentId);

    if (!updatedArticle) {
      return this.articleError('error updating comment;');
    }
    return {
      article: makeArticleObj(updatedArticle),
      comment: makeCommentObj(comment),
    };
  };
};
