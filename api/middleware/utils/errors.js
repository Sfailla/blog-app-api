const handleError = (res, error) => {
	if (process.env.NODE_ENV === 'development') {
		console.log(error);
	}

	res.status(error.code).send(error.message);
};

const buildErrorObject = (status, message) => {
	return {
		status,
		message
	};
};

class UserServiceError extends Error {
	constructor(...args) {
		super(...args);
		this.code = 'ERR_USER_SERVICE';
		this.name = 'UserServiceError';
		this.stack = `${this.message}\n${new Error().stack}`;
	}
}

class InvalidInputError extends Error {
	constructor(...args) {
		super(...args);
		this.code = 'ERR_INVALID_INPUT';
		this.name = 'InvalidInputError';
		this.stack = `${this.message}\n${new Error().stack}`;
	}
}

module.exports = {
	handleError,
	buildErrorObject
};
