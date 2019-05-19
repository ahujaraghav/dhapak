const express = require('express')
const router = express.Router()
const { Bookmark } = require('../models/Bookmark')
const {authenticateUserMw} = require('../middlewares/authenticateUserMw')

// strong parameters 
const allowedProperties = [
    "title", "orignalUrl", "tags"
]

//  This route is being tested -- not for changes
// authentication set
router.get('/', authenticateUserMw, function (req, res) {
    const user = req.user
    Bookmark.find({user})
        .then(function (bookmarks) {
            res.send(bookmarks)
        })
        .catch(function (err) {
            res.send(err)
        })
})

//  This route is being tested -- not for changes
//  authentication set
router.get('/:id', authenticateUserMw, function (req, res, next) {
    const user = req.user
    Bookmark.findOne({_id:req.params.id, user})
        .then(function (bookmark) {
            if (!bookmark) {
                return Promise.reject()
            }
            res.send(bookmark)
        })
        .catch(function (err) {
            res.locals.status = 404
            res.locals.message = { error: {} }
            res.locals.message.error._id = "No records Found"
            next(err)
        })
})

/***
* /bookmarks POST - creating a new bookmark
* title, orignalUrl are compulsary field's.
* this route is being tested 
*/
// authentication set
router.post('/', authenticateUserMw, function (req, res, next) {
    const body = req.body
    // const user = req.user
    const bookmark = new Bookmark(body)
    bookmark.user = req.user._id
    bookmark.save()
        .then(function (bookmark) {
            res.send(bookmark)
        })
        .catch(function (err) {
            let message = { error: {} }
            for (let key in err.errors) {
                message.error[key] = err.errors[key].properties.message
            }
            res.locals.status = 422
            res.locals.message = message
            next(err)
        })
})

/*** 
 * /bookmarks/:id PUT, this method update's bookmark
 *  only properties mentioned in allowedProperties array can be altered
 *  this route is being tested
 * */ 
// authentication set
router.put('/:id', authenticateUserMw, function (req, res, next) {
    const body = req.body
    const user = req.user
    const update = {}

    allowedProperties.forEach((property)=>{
        if(body[property]){
            update[property] = body[property]
        }
    })

    Bookmark.findOneAndUpdate({_id:req.params.id, user}, { $set: update }, { new: true, runValidators: true })
        .then(function (bookmark) {
            if(!bookmark){
                return Promise.reject()
            }
            res.send(bookmark)
        })
        .catch(function (err) {
            res.locals.message = { error: {} }
            res.locals.status = 404
            res.locals.message.error._id = "No records found to update"
            next(err)
        })
})

//authentication set
router.delete('/:id',authenticateUserMw, function (req, res) {
    const body = req.body
    const user = req.user
    Bookmark.findOneAndDelete({_id:req.params.id, user})
        .then(function (bookmark) {
            res.send(bookmark)
        })
        .catch(function (err) {
            res.send(err)
        })
})


router.get('/tags', function (req, res) {
    const tags = req.query.names.split(',')
    Bookmark.find({
        tags: {
            "$in": tags
        }
    })
        .then(function (bookmarks) {
            res.send(bookmarks)
        })
        .catch(function (err) {
            res.send(err)
        })
})

router.get('/tags/:name', function (req, res) {
    Bookmark.find({ tags: req.params.name })
        .then(function (bookmarks) {
            res.send(bookmarks)
        })
        .catch(function (err) {
            res.send(err)
        })
})



module.exports = {
    bookmarkRouter: router
}

