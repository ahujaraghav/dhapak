const { User } = require('../models/User')

function authenticateUserMw(req, res, next) {
    const token = req.header('x-auth')
    if (token) {
        User.authenticateUser(token)
            .then((user) => {
                req.user = user
                next()
            })
            .catch(() => {
                res.status(401).send("Please login")
            })
    }else{
        res.status(401).send("Please login")
    }
}

module.exports = {
    authenticateUserMw
}