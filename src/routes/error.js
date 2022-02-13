const express = require('express')

let errorController = require('../controllers/errorControllers.js')
let router = express.Router()

router.get('/', errorController.notfound)

module.exports = router