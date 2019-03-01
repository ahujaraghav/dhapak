const express = require('express')
const router = express.Router()
const {Bookmark} = require("../models/Bookmark")

router.get('/:hash', function(req, res){
    Bookmark.find({hashUrl:req.params.hash})
    .then(function(bookmarks){
        const bookmark = bookmarks[0]
        const url = "http://"+bookmark.orignalUrl
        res.redirect(url)
    })
    .catch(function(err){
        res.send(err)
    })
    // res.redirect('http://www.google.com')
})

module.exports = {
    rootRouter : router
}