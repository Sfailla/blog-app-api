const mongoose = require('mongoose')
const validator = require('validator')
const { Schema, model } = mongoose

const typeProps = { trim: true, unique: true, index: true }
const requiredString = {
  type: String,
  required: [true, 'must provide field']
}

const validateEmail = {
  validator: value => {
    return validator.isEmail(value)
  },
  message: '{VALUE} is not a valid email address'
}

const UserSchema = new Schema(
  {
    username: { ...requiredString, ...typeProps },
    email: {
      ...requiredString,
      ...typeProps,
      lowercase: true,
      validate: validateEmail
    },
    password: { ...requiredString, trim: true },
    role: {
      type: String,
      enum: ['user', 'moderator', 'admin'],
      default: 'user'
    },
    createdAt: { type: Date, default: Date.now }
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        delete ret._id
        delete ret.password
      }
    }
  }
)

module.exports = model('User', UserSchema)
