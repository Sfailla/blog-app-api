module.exports = class TagsController {
	constructor(articleModel) {
		this.tags = articleModel;
	}

	getAllTags = async (req, res, next) => {
		const tags = await this.tags.find({}).distinct('tags');
		if (!tags) {
			const errMsg = 'error fetching all tags';
			const err = new ValidationError(400, errMsg);
			next(err);
		}
		return await res.status(200).json({ tags });
	};
};
