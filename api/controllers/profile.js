module.exports = class ProfileController {
	constructor(databaseService) {
		this.service = databaseService;
	}

	getProfile = async (req, res, next) => {
		// console.log(this.service);
	};
};
