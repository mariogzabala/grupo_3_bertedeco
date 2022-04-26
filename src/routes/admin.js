const express = require('express')
const router = express.Router()

const adminController = require('../controllers/adminControllers.js')

router.get('/', adminController.test)

module.exports = router