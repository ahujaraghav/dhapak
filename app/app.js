const express = require('express')
const app = express()
app.use(express.json())

const {mongoose} = require('../config/database')

const {bookmarkRouter} = require('./controllers/BookmarkController')
const {rootRouter} = require('../app/controllers/RootController')


// - Setup to log every request
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' })

// ! First middleware for logging
app.use(morgan('combined',{stream:accessLogStream}))

// ! Second middleware for /bookmarks
app.use('/bookmarks', bookmarkRouter)

// ! Third middleware for all other routes
app.use('/', rootRouter)

// ! last middleware for throwing errors
app.use(function(req, res, next){
    throw new Error("404 bad-request")
})

// - Error listener - 4 params
app.use(function(err, req, res, next){
    const error = err.message.split(' ')
    const status = error[0]
    const message = error[1]
    res.status(status).send(message)
})

module.exports = {
    app
}