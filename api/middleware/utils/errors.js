class UniqueConstraintError extends Error {
	constructor(status = 409, message, value) {
		super(`${value} must be unique.`);

		this.status = status;
		this.code = 'ERR_UNIQUE_CONSTRAINT';
		this.name = 'unique-constraint-error';
		this.messge = message;
		this.stack = `${new Error().stack}`;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, UniqueConstraintError);
		}
	}
}

class InvalidPropertyError extends Error {
	constructor(status = 400, message) {
		super(message);

		this.status = status;
		this.code = 'ERR_INVALID_PROPERTY';
		this.name = 'invalid-property-error';
		this.messge = message;
		this.stack = `${new Error().stack}`;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, InvalidPropertyError);
		}
	}
}

class RequiredParameterError extends Error {
	constructor(status = 400, message, param) {
		super(`${param} can not be null or undefined.`);

		this.status = status;
		this.code = 'ERR_REQUIRED_PARAM';
		this.name = 'required-param-error';
		this.message = message;
		this.stack = `${new Error().stack}`;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, RequiredParameterError);
		}
	}
}

class UserServiceError extends Error {
	constructor(status = 400, message) {
		super(message);

		this.status = status;
		this.code = 'ERR_USER_SERVICE';
		this.name = 'user-service-error';
		this.message = message;
		this.stack = `${this.stack}`;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, UserServiceError);
		}
	}
}

class InvalidInputError extends Error {
	constructor(status = 500, message) {
		super(message);

		this.status = status;
		this.code = 'ERR_INVALID_INPUT';
		this.name = 'invalid-input-error';
		this.message = `${this.message}`;
		this.stack = `${this.message}\n${new Error().stack}`;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, InvalidInputError);
		}
	}
}

const buildErrorObject = (code, msg) => {
	return {
		code,
		msg
	};
};

module.exports = {
	UniqueConstraintError,
	InvalidPropertyError,
	RequiredParameterError,
	UserServiceError,
	InvalidInputError,
	buildErrorObject
};
