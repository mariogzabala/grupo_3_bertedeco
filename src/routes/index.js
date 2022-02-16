const express = require('express')
const router = express.Router()

const indexController = require('../controllers/indexControllers.js')

router.get('/', indexController.home)

router.get('/home', indexController.home)

module.exports = router
