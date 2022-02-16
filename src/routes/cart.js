const express = require('express')
const router = express.Router()

const cartController = require('../controllers/cartControllers.js')

router.get('/resume', cartController.resume)

module.exports = router
