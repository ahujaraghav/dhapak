const assert = require('assert')
const request = require('supertest')
const { app } = require('../../app/app')
const { Bookmark } = require('../../app/models/Bookmark')


describe("Testing POST  /bookmarks", () => {

    let bookmark

    beforeEach((done) => {
        const data = {
            title: "This is a test data",
            orignalUrl: "www.google.com",
            tags: "Javascript, Node js, Mongodb, Ajax"
        }
        bookmark = new Bookmark(data)
        bookmark.save()
            .then(() => {
                console.log("created 1 new bookmark")
                done()
            })
    })

    it("/bookmarks POST - invalidId case test(required fields not sent)", (done) => {
        let data = {}
        request(app)
            .post('/bookmarks').send(data).end((err, res) => {
                const keys = Object.keys(res.body.error)
                assert(keys.includes('title'))
                assert(keys.includes('orignalUrl'))
                assert(keys.includes('hashUrl'))
                assert(res.status == 422)
                done()
            })
    })

    it("/bookmarks GET -  validID case test(getting all bookmarks)", (done) => {
        request(app)
            .get('/bookmarks').end((err, res) => {
                assert(res.body.length == 1)
                assert(res.body[0]._id == bookmark._id)
                done()
            })
    })


    it("/bookmarks/:id GET - validID and invalidId cases test", (done) => {
        const validId = bookmark._id
        const invalidId = "12345"
        const deletedId = "5c975e6838bea108fbbb3c61"

        // ? A validId id which will get a validID bookmark as response
        request(app)
            .get(`/bookmarks/${validId}`)
            .end((err, res) => {
                assert(res.status == 200)
                assert(res.body._id == bookmark._id)
            })

        // ? A invalidId format id which will return no record found
        request(app)
            .get(`/bookmarks/${invalidId}`)
            .end((err, res) => {
                assert(res.status == 404)
                assert(res.body.error._id == 'No records Found')
            })

        // ? A validID format id but not present in database which will return no record found
        request(app)
            .get(`/bookmarks/${deletedId}`)
            .end((err, res) => {
                assert(res.status == 404)
                assert(res.body.error._id == 'No records Found')
                done()
            })
    })

})
