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

const trimRequest = object => {
	const trimValue = str => str.trim();
	const type = Object.prototype.toString.call(object).slice(8, -1).toLowerCase();

	if (type === 'object') {
		let cloned = {};
		for (let key in object) {
			if (object.hasOwnProperty(key)) {
				cloned[key] = trimRequest(object[key]);
			}
		}
		return cloned;
	}

	// If an array, create a new array and recursively trim
	if (type === 'array') {
		return object.map(item => {
			return trimRequest(item);
		});
	}

	// If the data is a string, trim it
	if (type === 'string') {
		return trimValue(object);
	}

	// Otherwise, return object as is
	return object;
};

module.exports = {
	trimRequest
};
