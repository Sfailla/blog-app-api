const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose
	.connect(process.env.MONGOOSE_URI, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useCreateIndex: true
	})
	.then(() => console.log('connection established to MLAB database'))
	.catch(
		err =>
			new Error(
				`${err.name} \n there is an error with mongoose connect: ${err.code} ${err.errmsg}`
			)
	);

module.exports = mongoose;
