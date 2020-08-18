class UniqueConstraintError extends Error {
	constructor(value) {
		super(`${value} must be unique.`);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, UniqueConstraintError);
		}
	}
}

class InvalidPropertyError extends Error {
	constructor(msg) {
		super(msg);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, InvalidPropertyError);
		}
	}
}

class RequiredParameterError extends Error {
	constructor(param) {
		super(`${param} can not be null or undefined.`);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, RequiredParameterError);
		}
	}
}

class UserServiceError extends Error {
	constructor(...args) {
		super(...args);
		const [ code, message ] = args;

		this.code = code || 500;
		this.status = 'ERR_USER_SERVICE';
		this.name = 'user-service-error';
		this.message = message || 'something went wrong';
		this.stack = `${new Error().stack}`;
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
	UniqueConstraintError,
	InvalidPropertyError,
	RequiredParameterError,
	UserServiceError,
	InvalidInputError
};
