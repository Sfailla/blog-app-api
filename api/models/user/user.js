const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
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

UserSchema.methods.isValidObjectId = function(userId) {
	return (
		ObjectId.isValid(id) && new ObjectId(id).toString() === userId
	);
};

module.exports = mongoose.model('User', UserSchema);
