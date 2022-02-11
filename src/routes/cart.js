const express = require('express')

let cartController = require('../controllers/cartControllers.js')
let router = express.Router()

router.get('/resume', cartController.resume)

module.exports = router