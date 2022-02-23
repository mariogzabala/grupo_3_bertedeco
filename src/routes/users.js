const express = require('express')
const router = express.Router()

const usersController = require('../controllers/usersControllers.js')

router.get('/login', usersController.login)

router.get('/register', usersController.register)

router.get('/profile', usersController.profile)

module.exports = router
