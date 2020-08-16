const handleError = (res, error) => {
	if (process.env.NODE_ENV === 'development') {
		console.log('handleErr', error);
	}

	res.status(error.status).json({ error });
};

const buildErrorObject = (status, message) => {
	return {
		status,
		message
	};
};

module.exports = {
	handleError,
	buildErrorObject
};
