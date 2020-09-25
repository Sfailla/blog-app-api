module.exports = class TagsController {
	constructor(articleModel) {
		this.article = articleModel;
	}

	getAllTags = async (req, res, next) => {
		const tags = await this.article.find({}).distinct('tags');
		if (!tags) {
			const errMsg = 'error fetching all tags';
			const err = new ValidationError(400, errMsg);
			next(err);
		}
		return await res.status(200).json({ tags });
	};
};
