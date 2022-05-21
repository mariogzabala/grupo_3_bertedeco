const express = require('express')
const router = express.Router()

const productsController = require('../controllers/productsControllers.js')

/* Lista de productos */
router.get('/', productsController.list)

/* Detalle de producto */
router.get('/detail/:id', productsController.detail)

/* Mostrar formulario crear*/
router.get('/create', productsController.create)

/* Guardar porducto */
router.post('/create/:id', productsController.store)

/* Mostrar formulario editar */
router.get('/edit', productsController.edit) 

/* Modificar producto */
router.post('/edit/:id', productsController.update)

/* Elimiar producto desde formulario de edicion*/
router.delete('/delete/:id', productsController.destroy)

/* Mostrar descuentos*/
router.get('/discounts', productsController.discounts)

/* Mostrar descuentos*/
router.post('/discounts/create/:id', productsController.creatediscount)

/* Mostrar descuentos*/
router.put('/discounts/edit/:id', productsController.editdiscount)

/* Mostrar descuentos*/
router.delete('/discounts/delete/:id', productsController.deletediscount)

/* Api lista de productos*/
router.get('/api/products', productsController.apiproducts)

/* Api detalle de producto*/
router.get('/api/products/:id', productsController.apiproductsid)

module.exports = router
