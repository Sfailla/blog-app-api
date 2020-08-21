module.exports = class ArticleDatabaseService {
	constructor(articleModel) {
		this.db = articleModel;
	}

	create = async (user_id, title, description, body) => {
		const article = await this.db.create({
			author: user_id,
			title,
			description,
			body
		});
		return { article };
	};
};
