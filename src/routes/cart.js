const express = require('express')
const router = express.Router()

const cartController = require('../controllers/cartControllers.js')
const cartMiddleware = require('../middlewares/cartAuthMiddleware.js')

router.get('/resume/:user_id', cartMiddleware, cartController.resume)

router.get('/additem/:user_id/:prod_id?', cartMiddleware, cartController.main)

router.delete('/deleteitem/:user_id/:item_id', cartMiddleware, cartController.deleteItem)

/* router.post('/updateitem/:cart_id/:item_id', cartMiddleware, cartController.updateItem) */

module.exports = router
