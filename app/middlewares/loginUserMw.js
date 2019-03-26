const validator = require('validator')
const { User } = require('../models/User')

function loginUserMw(req, res, next) {
    const body = req.body
    if (body.email && body.password) {
        const validEmail = validator.isEmail(body.email)
        if (!validEmail) {
            res.send({ error: { email: "Invalid email address" } })
        } else {
            User.checkLoginCredentials({ email: body.email, password: body.password })
                .then((user) => {
                    req.user = user
                    next()
                })
                .catch(function (err) {
                    res.status(403).send("Incorrect email or password")
                })
        }
    } else {
        const message = { error: {} }
        if (!body.email) {
            message.error.email = "Email is required"
        }
        if (!body.password) {
            message.error.password = "Password is required"
        }
        res.status(422).send(message)
    }
}

module.exports = {
    loginUserMw
}