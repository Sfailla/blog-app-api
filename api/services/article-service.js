module.exports = class ArticleDatabaseService {
	constructor(articleModel) {
		this.db = articleModel;
	}

	create = async (user_id, slug, title, description, body) => {
		console.log(user_id);
		const article = await this.db.create({
			author: user_id,
			slug,
			title,
			description,
			body
		});
		return { article };
	};
};
