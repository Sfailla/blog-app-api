const colorTerminal = require('../../config/terminalColors');

// catch 404 and forward to error handler
const notFoundHandler = (req, res, next) => {
	let error = new Error(`Not Found 🤔 - ${req.originalUrl}`);
	error.status = 404;
	res.status(404);
	next(error);
};

const errorHandler = (error, req, res, next) => {
	const isDevelopment = req.app.get('env') === 'development';
	// set locals, only providing error in development
	res.locals.message = error.message;
	res.locals.error = isDevelopment ? error : {};
	// render the error page
	res.status(error.status || 500);

	console.log('HANDLER', error);
	res.json({
		error: {
			status: error.status,
			message: error.message,
			stack: isDevelopment ? error.stack : {}
		}
	});
};

const handleListen = (port, env) => {
	console.log(
		colorTerminal('yellow'),
		`port listening on ${port} \nNODE_ENV=${env}`
	);
};

module.exports = {
	notFoundHandler,
	errorHandler,
	handleListen
};
