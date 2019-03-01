const express = require('express')
const router = express.Router()
const { Bookmark } = require('../models/Bookmark')

router.get('/', function (req, res) {
    Bookmark.find()
        .then(function (bookmarks) {
            res.send(bookmarks)
        })
        .catch(function (err) {
            res.send(err)
        })
})

router.get('/tags', function (req, res) {
    const tags = req.query.names.split(',')
    Bookmark.find({
        tags: {
            "$in":tags
        }
    })
    .then(function(bookmarks){
        res.send(bookmarks)
    })
    .catch(function(err){
        res.send(err)
    })
})

router.get('/:id', function (req, res) {
    Bookmark.findById(req.params.id)
        .then(function (bookmark) {
            res.send(bookmark)
        })
        .catch(function (err) {
            res.send(err)
        })
})

router.post('/', function (req, res) {
    const body = req.body
    const bookmark = new Bookmark(body)
    // console.log(body)
    bookmark.save()
        .then(function (bookmark) {
            // console.log("pass")
            res.send(bookmark)
        })
        .catch(function (err) {
            // console.log("fail")
            res.send(err)
        })
})


router.put('/:id', function (req, res) {
    const body = req.body
    console.log(body)
    console.log(req.params.id)
    Bookmark.findByIdAndUpdate(req.params.id, { $set: body }, { new: true, runValidators: true })
        .then(function (bookmark) {
            res.send(bookmark)
        })
        .catch(function (err) {
            console.log("error")
            res.send(err)
        })
})

router.delete('/:id', function (req, res) {
    const body = req.body
    Bookmark.findByIdAndDelete(req.params.id)
        .then(function (bookmark) {
            res.send(bookmark)
        })
        .catch(function (err) {
            res.send(err)
        })
})

router.get('/tags/:name', function (req, res) {
    Bookmark.find({tags: req.params.name})
    .then(function(bookmarks){
        res.send(bookmarks)
    })
    .catch(function(err){
        res.send(err)
    })
})



module.exports = {
    bookmarkRouter: router
}

