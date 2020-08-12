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
	res.json({
		error: {
			status: error.status,
			message: isDevelopment ? error.message : {},
			stack: isDevelopment ? error.stack : {}
		}
	});
};

module.exports = {
	notFoundHandler,
	errorHandler
};
