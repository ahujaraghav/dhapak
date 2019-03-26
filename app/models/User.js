const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: {
            validator: function () {
                return validator.isEmail(this.email)
            },
            message: "Invalid email address"
        }
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        validate: {
            validator: function () {
                if (this.gender == 'male' || this.gender == 'female' || this.gender == 'transgender') {
                    return true
                } else {
                    return false
                }
            },
            message: "Invalid gender"
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    tokens: [{
        token: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
})

// Generating hash password pre-save
/**
 * During validation, which will happen before this, if password is not provided we will send error directly
 */
userSchema.pre('save', function (next) {
    const user = this
    if (user.isNew) {
        const password = user.password
        bcrypt.genSalt(10)
            .then(function (salt) {
                bcrypt.hash(password, salt)
                    .then(function (encryptedPassword) {
                        user.password = encryptedPassword
                        next()
                    })
            })
    }
    next()
})

// Login user
/**
 * Validation of email and password is done in MW.
 */
userSchema.statics.checkLoginCredentials = function (unauthUser) {
    const User = this
    return User.findOne({ email: unauthUser.email })
        .then(function (user) {
            if (!user) {
                return Promise.reject()
            }
            return bcrypt.compare(unauthUser.password, user.password)
                .then((result) => {
                    if (result == true) {
                        return Promise.resolve(user)
                    }
                    else {
                        return Promise.reject()
                    }
                })
        })
}

// Authenticate user
/**
 * Token is provided by MW, this function make's tokenData from token
 * which has _id field holding user id, then we do User.findById(tokenData._id)
 * if we found the user, we match the token provided in user's token array, if present
 * we resolve the promise and send user.
 */
userSchema.statics.authenticateUser = function (token) {
    const User = this
    let tokenData
    try {
        tokenData = jwt.verify(token, 'secret@123')
    } catch (err) {
        return Promise.reject(err)
    }

    const userId = tokenData._id
    return User.findById(userId)
        .then((user) => {
            const found = user.tokens.find((element) => {
                return element.token == token
            })
            if (found) {
                return Promise.resolve(user)
            } else {
                return Promise.reject()
            }
        })
        .catch((err)=>{
            Promise.reject(err)
        })
}

// Generate Token
userSchema.methods.generateToken = function () {
    const user = this
    const date = new Date()
    const tokenData = {
        email: user.email,
        _id: user._id,
        date: date
    }
    let token
    try {
        token = jwt.sign(tokenData, 'secret@123')
    }
    catch (err) {
        console.log(err)
    }
    user.tokens.push({ token, email: user.email, date })
    return user.save()
        .then((user) => {
            return Promise.resolve(token)
        })
        .catch((err) => {
            return Promise.reject()
        })
}




const User = mongoose.model('User', userSchema)
module.exports = {
    User
}