const express = require('express')
const router = express.Router()

const errorController = require('../controllers/errorControllers.js')

router.get('/', errorController.notfound)

module.exports = router
