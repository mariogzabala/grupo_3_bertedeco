const express = require('express')

let indexController = require('../controllers/indexControllers.js')
let router = express.Router()

router.get('/', indexController.home)

router.get('/home', indexController.home)

module.exports = router