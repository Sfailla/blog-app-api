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
	const { err_code, message, stack } = error;
	// set locals, only providing error in development
	res.locals.message = message;
	res.locals.status = 'ERROR';
	res.locals.error = isDevelopment ? error : {};

	console.log(res.locals);

	res.status(err_code || 500).json({
		error: {
			err_code,
			status: 'ERROR',
			message,
			stack: isDevelopment ? stack : {}
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
