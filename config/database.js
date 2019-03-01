const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/dhapak'
mongoose.Promise = global.Promise
mongoose.connect(url,{ useNewUrlParser: true })
    .then(function () {
        console.log("connected to db")
    })
    .catch(function () {
        console.log("error connecting to db")
    })

module.exports = {
    mongoose
}