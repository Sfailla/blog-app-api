const mongoose = require('mongoose')
const { Schema, Types, model } = mongoose
const { ObjectId } = Types

const CommentSchema = new Schema(
  {
    author: { type: ObjectId, ref: 'Profile' },
    article: { type: ObjectId, ref: 'Article' },
    comment: { type: String, required: true, trim: true },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        delete ret._id
      }
    }
  }
)

CommentSchema.methods.deleteComment = async function (userId, commentId) {
  if (this.author.toString() === userId.toString()) {
    if (this._id.toString() === commentId.toString()) {
      await this.remove(commentId)
    }
  }
  return
}

module.exports = CommentSchema
module.exports = model('Comment', CommentSchema)
