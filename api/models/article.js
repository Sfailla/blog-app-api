const mongoose = require('mongoose')
const Profile = require('./profile')
const { formatSlug } = require('../helpers/article')

const { Schema, Types, model } = mongoose
const { ObjectId } = Types

const typeProps = { trim: true, unique: true, index: true }
const requiredString = { type: String, required: [true, 'must provide field'] }

const ArticleSchema = new Schema(
  {
    author: { type: ObjectId, ref: 'Profile' },
    title: { type: String, ...typeProps },
    description: { ...requiredString, trim: true },
    body: { ...requiredString, trim: true },
    image: { type: String, default: null },
    comments: [{ type: ObjectId, ref: 'Comment', default: [] }],
    tags: [{ type: String, trim: true, lowercase: true, default: [] }],
    favoriteCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    slug: {
      ...requiredString,
      ...typeProps,
      default: function () {
        return formatSlug(this.title)
      }
    }
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

ArticleSchema.methods.updateCount = async function () {
  const count = await Profile.countDocuments({
    favorites: { $in: [this._id] }
  })
  this.favoriteCount = count
  return this.save()
}

ArticleSchema.methods.addComment = async function (articleId, comment) {
  if (this._id.toString() === articleId.toString()) {
    await this.comments.push(comment)
  }
  return await this.save()
}

ArticleSchema.methods.deleteComment = async function (commentId) {
  if (this.comments.includes(commentId)) {
    await this.comments.remove(commentId)
  }
  return await this.save()
}

module.exports = model('Article', ArticleSchema)
