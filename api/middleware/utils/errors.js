const handleError = (res, error) => {
	if (process.env.NODE_ENV === 'development') {
		console.log(error);
	}

	res.status(error.code).json({
		error: {
			message: error.message
		}
	});
};

module.exports = handleError;
