const express = require('express')
const router = express.Router()
const { Bookmark } = require("../models/Bookmark")
const useragent = require('express-useragent')

router.get('/:hash', function (req, res, next) {
    Bookmark.find({ hashUrl: req.params.hash })
        .then((bookmarks)=>{
            // ? Better way to do this?
            if (bookmarks.length == 0) {
                const error = new Error("404 no-matching-url")
                // throw new Error("404 bad-request") this wont work.
                next(error)
            }
            else {
                const bookmark = bookmarks[0]
                const url = "http://" + bookmark.orignalUrl

                // - Logging for each url click inside database
                const click = {}
                const source = req.headers['user-agent']
                const ua = useragent.parse(source)
                click.ip = req.ip; click.browser = ua.browser; click.os = ua.os; click.device = ua.platform
                bookmark.click.push(click)
                bookmark.save()
                
                // - Redirecting the user to the original url
                res.redirect(url)
            }
        })
        .catch(function (err) {
            res.send(err)
        })
})

module.exports = {
    rootRouter: router
}