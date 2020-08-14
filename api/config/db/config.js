const mongoose = require('mongoose');
const colorTerminal = require('../terminalColors');

const makeMongooseConnection = async () => {
	const mongooseOptions = {
		useNewUrlParser: true,
		useFindAndModify: false,
		useCreateIndex: true,
		useUnifiedTopology: true,
		connectTimeoutMS: 1000,
		promiseLibrary: global.Promise
	};

	const url = process.env.MONGOOSE_URL;
	const userMessage = 'connection established to MLAB database';

	try {
		await mongoose.connect(url, mongooseOptions);
		console.log(colorTerminal('magenta'), userMessage);
	} catch (err) {
		return new Error(
			`${err.name} \n there is an error with mongoose connect: ${err.code} ${err.errmsg}`
		);
	}

	return {
		message: 'mongoose is not connected'
	};
};

module.exports = {
	makeMongooseConnection
};
