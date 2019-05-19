const mongoose = require('mongoose')
const validator = require('validator')
const shorthash = require('shorthash')
const Schema = mongoose.Schema
const bookmarkSchema = new Schema({
    title: {
        required: [true, "Title is required"],
        type: String
    },
    orignalUrl: {
        required: [true,"URL is required"],
        type: String,
        validate: {
            validator: function (value) {
                return validator.isURL(value)
            },
            message: function () {
                return "Invalid URL"
            }
        }
    },
    hashUrl: {
        type: String,
        required: [true, "Original URL error - hash cannot be generated"]
    },
    tags: {
        type: [String]
    },
    createdAt: {
        type: Date,
        default: new Date
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    click: [{ ip: String, browser: String, device: String, os: String }]
})

bookmarkSchema.pre('validate', function (next) {
    const bookmark = this
    if (this.orignalUrl) {
        this.hashUrl = shorthash.unique(this.orignalUrl)
    }
    next()
})

const Bookmark = mongoose.model('Bookmark', bookmarkSchema)

module.exports = {
    Bookmark
}