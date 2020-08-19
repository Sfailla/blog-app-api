const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: [ true, 'username is required parameter' ]
	},
	email: {
		type: String,
		unique: true,
		required: [ true, 'email is required parameter' ],
		set: value => value.toLowerCase(),
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
			message: '{VALUE} is not a valid password'
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

UserSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: (_, ret) => {
		delete ret._id;
		delete ret.password;
	}
});

UserSchema.methods.isValidObjectId = function(userId) {
	return (
		ObjectId.isValid(id) && new ObjectId(id).toString() === userId
	);
};

module.exports = mongoose.model('User', UserSchema);
