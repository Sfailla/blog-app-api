// catch 404 and forward to error handler
const notFoundHandler = (req, res, next) => {
	let error = new Error(`Not Found 🤔 - ${req.originalUrl}`);
	error.status = 404;
	res.status(404);
	next(error);
};

const errorHandler = (error, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = error.message;
	res.locals.error =
		req.app.get('env') === 'development' ? error : {};

	// render the error page
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
			status: error.status,
			stack: req.app.get('env') === 'development' ? error.stack : {}
		}
	});
};

module.exports = {
	notFoundHandler,
	errorHandler
};
