const express = require('express')

let productsController = require('../controllers/productsControllers.js')
let router = express.Router()

/* productid es el nombre del archivo html que es un detalle de producto */
router.get('/detail/:productid?', productsController.detail)

router.get('/list', productsController.list)

router.get('/admin', productsController.admin)

router.get('/', productsController.empty)

module.exports = router