const { buildErrorObject } = require('../middleware/utils/errors');

const validate = (value, field) => {
	let message;
	let error;
	if (!value.length) {
		message = `sorry must provide ${field}`;
		error = true;
	}

	if (error) return buildErrorObject(400, message);

	return true;
};

module.exports = validate;
