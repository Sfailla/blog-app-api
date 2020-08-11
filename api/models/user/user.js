const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [ true, 'username is required' ]
	},
	email: {
		type: String,
		required: [ true, 'email is required' ],
		validate: {
			validator: value => {
				return validator.isEmail(value);
			},
			message: '{VALUE} is not a valid email address'
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 15,
		validate: {
			validator: value => {
				return !validator.isEmpty(value);
			},
			message: '{VALUE} cannot be empty'
		}
	},
	role: {
		type: String,
		enum: [ 'user', 'admin' ],
		default: 'user'
	},
	// tokens: [
	// 	{
	// 		access: {
	// 			type: String,
	// 			required: true,
	// 			validate: {
	// 				validator: value => {
	// 					return validator.isAlphanumeric(value);
	// 				},
	// 				message: '{VALUE} must be type string or int'
	// 			}
	// 		},
	// 		token: {
	// 			type: String,
	// 			required: true,
	// 			validate: {
	// 				validator: value => {
	// 					return validator.isJWT(value);
	// 				},
	// 				message: '{VALUE} must be valid jason-web-token'
	// 			}
	// 		}
	// 	}
	// ],
	createdAt: {
		type: Date,
		default: Date.now,
		validate: {
			validator: value => {
				return validator.isDate(value);
			},
			message: '{VALUE} must be type date'
		}
	}
});

module.exports = mongoose.model('User', UserSchema);
