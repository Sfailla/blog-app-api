// const handleError = (res, error) => {
// 	if (process.env.NODE_ENV === 'development') {
// 		console.log(error);
// 	}

// 	const err = new Error(error);
// 	res.status(err.code).send(err);
// 	// next(err);
// };

// const buildErrorObject = (status, msg) => {
// 	return {
// 		status,
// 		msg
// 	};
// };

// module.exports = {
// 	handleError,
// 	buildErrorObject
// };

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

module.exports = UserServiceError;
module.exports = InvalidInputError;
