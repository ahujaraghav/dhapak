const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/dhapak'
mongoose.Promise = global.Promise

if (process.env.NODE_ENV !== 'test') { 
mongoose.connect(url, { useNewUrlParser: true })
    .then(function () {
        console.log("connected to development db")
    })
    .catch(function () {
        console.log("error connecting to db")
    })
}

module.exports = {
    mongoose
}