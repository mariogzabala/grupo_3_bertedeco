const express = require('express')
const router = express.Router()

const adminController = require('../controllers/adminControllers.js')

router.get('/', adminController.loginAdmin)

router.post('/auth', adminController.authentication)

module.exports = router
