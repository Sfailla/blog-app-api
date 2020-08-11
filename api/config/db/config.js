const mongoose = require('mongoose');

function makeMongooseConnection() {
	const mongooseOptions = {
		useNewUrlParser: true,
		useFindAndModify: false,
		useCreateIndex: true,
		useUnifiedTopology: true,
		connectTimeoutMS: 1000,
		promiseLibrary: global.Promise
	};

	const userMessage = 'connection established to MLAB database';
	const errorMessage = err =>
		`${err.name} \n there is an error with mongoose connect: ${err.code} ${err.errmsg}`;

	if (process.env.MONGOOSE_URL) {
		return mongoose
			.connect(process.env.MONGOOSE_URL, mongooseOptions)
			.then(() => console.log(userMessage))
			.catch(err => new Error(errorMessage(err)));
	}

	return {
		message: 'mongoose is not connected'
	};
}

module.exports = {
	makeMongooseConnection
};
