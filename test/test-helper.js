const mongoose = require('mongoose')

before((done) => {
    mongoose.connect("mongodb://localhost:27017/dhapak_test", { useNewUrlParser: true })
        .then(() => {
            console.log("connected to test db")
            done()
        })
        .catch(() => {
            console.log("error connecting to test db")
        })
})

beforeEach((done) => {
    const bookmarks = mongoose.connection.collections.bookmarks
    if (bookmarks) {
        bookmarks.drop(() => {
            console.log("Dropped bookmark collection")
            done()
        })
    } else {
        done()
    }
})