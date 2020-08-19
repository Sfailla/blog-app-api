const handleError = (res, error) => {
	if (process.env.NODE_ENV === 'development') {
		console.log('handleErr', error);
	}

	res.status(error.status).json({ error });
};

const buildErrorObject = (code, msg) => {
	return {
		code,
		msg
	};
};

module.exports = {
	handleError,
	buildErrorObject
};
