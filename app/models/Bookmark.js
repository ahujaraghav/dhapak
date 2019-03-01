const mongoose = require('mongoose')
const validator = require('validator')
const shorthash = require('shorthash')
const Schema = mongoose.Schema
const bookmarkSchema = new Schema({
    title:{
        required: true,
        type: String
    },
    orignalUrl:{
        required: true,
        type: String,
        validate:{
            validator: function(value){
                return validator.isURL(value)
            },
            message: function(){
                return "invalid url, please enter a valid url"
            }
        }
    },
    hashUrl:{
        type: String,
        required: true
    },
    tags:{
        type: [String]
    },
    createdAt:{
        type: Date,
        default: new Date
    }
})

bookmarkSchema.pre('validate', function(next){
    const bookmark = this
    this.hashUrl = shorthash.unique(this.orignalUrl)
    next()
})

const Bookmark = mongoose.model('Bookmark', bookmarkSchema)

module.exports = {
    Bookmark
}