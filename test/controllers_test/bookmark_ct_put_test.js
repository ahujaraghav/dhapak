const request = require('supertest')
const assert = require('assert')
const { Bookmark } = require('../../app/models/Bookmark')
const { app } = require('../../app/app')

describe.only("Testing /bookmarks PUT", () => {

    let bookmark
    let validId
    const invalidId = "12345"
    const deletedId = "5c975e6838bea108fbbb3c61"

    const validUpdate = {
        title: "Update Test",
        orignalUrl: "www.test.com",
        tags: "tag1, tag2, tag3",
        // ! These items should not be changed
        createdAt: new Date().setFullYear(1993, 6, 24),
        click: [{ ip: "hacked", browser: "hacked", device: "hacked", os: "hacked" }],
        hashUrl: "hacked"
    }

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
                validId = bookmark._id
                done()
            })
    })


    it("valid data and valid id", (done) => {
        request(app)
            .put(`/bookmarks/${validId}`)
            .send(validUpdate)
            .end((err, res) => {
                assert(res.body.title == validUpdate.title)
                assert(res.body.tags == validUpdate.tags)
                assert(res.body.orignalUrl == validUpdate.orignalUrl)

                assert(res.body.createdAt !== validUpdate.createdAt)
                assert(res.body.click.length == 0 || res.body.click[0].ip !== 'hacked')
                assert(res.body.hashUrl !== validUpdate.hashUrl)
                done()
            })
    })

    it("valid data and invalid id", (done) => {
        request(app)
            .put(`/bookmarks/${invalidId}`)
            .send(validUpdate)
            .end((err, res) => {
                assert(res.body.error._id == 'No records found to update')
                done()
            })
    })

    it("valid data and deleted id", (done) => {
        request(app)
            .put(`/bookmarks/${deletedId}`)
            .send(validUpdate)
            .end((err, res) => {
                assert(res.body.error._id == 'No records found to update')
                done()
            })
    })

})