const express = require('express')
const app = express()
const port = 3000
app.use(express.json())
const {mongoose} = require('../config/database')
const {Bookmark} = require('./models/Bookmark')
const {bookmarkRouter} = require('./controllers/BookmarkController')
const {rootRouter} = require('../app/controllers/RootController')

app.use('/bookmarks', bookmarkRouter)
app.use('/', rootRouter)


app.listen(port, function(){
    console.log("Server on ", port)
})