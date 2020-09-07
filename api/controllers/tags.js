module.exports = class TagsController {
	constructor(articleModel) {
		this.tags = articleModel;
	}

	getAllTags = async (req, res, next) => {
		const options = {
			limit: Number(req.query.limit)
		};
		const tags = await this.tags.find({}, null, options).distinct('tags');
		if (!tags) {
			const errMsg = 'error fetching all tags';
			const err = new ValidationError(400, errMsg);
			next(err);
		}
		return await res.status(200).json({ tags });
	};
};
