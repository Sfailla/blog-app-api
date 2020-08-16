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
		console.error(err);
		process.exit(1);
	}
};

module.exports = {
	makeMongooseConnection
};
