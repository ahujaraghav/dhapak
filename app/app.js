const express = require('express')
const app = express()
app.use(express.json())

const {mongoose} = require('../config/database')

const {bookmarkRouter} = require('./controllers/BookmarkController')
const {rootRouter} = require('../app/controllers/RootController')
const {userRouter} = require('../app/controllers/UserController')


// - Setup to log every request
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' })

// ! First middleware for logging
app.use(morgan('combined',{stream:accessLogStream}))

// ! Second middleware for /bookmarks
app.use('/bookmarks', bookmarkRouter)

app.use('/users', userRouter)

// ! Third middleware for all other routes
app.use('/', rootRouter)

// ! last middleware for throwing errors
app.use(function(req, res, next){
    throw new Error("404 bad-request")
})

// - Error listener - 4 params
app.use(function(err, req, res, next){
    if(!res.locals.status || !res.locals.message){
        res.status(500).send("Internal server error")
        console.log(err)
    }
    res.status(res.locals.status).send(res.locals.message)
})

module.exports = {
    app
}