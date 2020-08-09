const mongoose = require('mongoose');

const requiredString = validateMessage => ({
	type: String,
	required: [ true, validateMessage ]
});

const UserSchema = new mongoose.Schema({
	username: requiredString('username is required'),
	email: requiredString('email is required'),
	password: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 15,
		validate: {
			validator: 'some validation',
			message: 'password must meet criteria'
		}
	},
	role: {
		type: String,
		default: 'user'
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('User', UserSchema);
