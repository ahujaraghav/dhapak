const {User} = require('../models/User')
const express = require('express')
const validator = require('validator')
const router = express.Router()
const {loginUserMw} = require('../middlewares/loginUserMw')

// /users

// creating a new user
/** 
 * Upon first user.save(), generating the hashed password from plain password in model.
 */
router.post('/', (req, res, next)=>{
    const body = req.body
    const user = new User(body)
    user.save()
    .then(()=>{
        res.send(user)
    })
    .catch((err)=>{
        let message = { error: {} }
        for (let key in err.errors) {
            message.error[key] = err.errors[key].properties.message
        }
        res.locals.status = 422
        res.locals.message = message
        next(err)
    })
})

router.post('/login', loginUserMw, (req, res, next)=>{
        const user = req.user
        user.generateToken()
        .then((token)=>{
            res.setHeader('x-auth', token)
            res.status(200).send('success')
        })
})

module.exports = {
    userRouter: router
}