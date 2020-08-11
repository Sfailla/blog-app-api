const mongoose = require('mongoose');

function makeMongooseConnection() {
	if (process.env.MONGOOSE_URL) {
		return mongoose
			.connect(process.env.MONGOOSE_URL, {
				useNewUrlParser: true,
				useFindAndModify: false,
				useCreateIndex: true,
				useUnifiedTopology: true,
				connectTimeoutMS: 1000,
				promiseLibrary: global.Promise
			})
			.then(() =>
				console.log('connection established to MLAB database')
			)
			.catch(
				err =>
					new Error(
						`${err.name} \n there is an error with mongoose connect: ${err.code} ${err.errmsg}`
					)
			);
	}

	return {
		message: 'mongoose is not connected'
	};
}

module.exports = {
	makeMongooseConnection
};
