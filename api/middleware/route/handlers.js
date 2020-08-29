const colorTerminal = require('../../../config/terminalColors');

// catch 404 and forward to error handler
const notFoundHandler = (req, res, next) => {
	let error = new Error(`Not Found 🤔 - ${req.originalUrl}`);
	error.status = 404;
	res.status(404);
	next(error);
};

const errorHandler = (error, req, res, next) => {
	const isDevelopment = req.app.get('env') === 'development';
	const { code, status, name, message, stack } = error;

	// set locals, only providing error in development
	res.locals.status = status;
	res.locals.code = code;
	res.locals.name = name;
	res.locals.message = message;
	res.locals.error = isDevelopment ? error.toString() : {};

	res.status(status || 500).send({
		error: {
			status,
			code,
			name,
			message,
			stack
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
