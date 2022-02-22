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
router.post('/create', productsController.store)

/* Mostrar formulario editar */
router.get('/edit', productsController.edit); 

/* Modificar producto */
router.put('/edit/:id?', productsController.update);

/* Elimiar producto desde formulario de edicion*/
router.delete('/delete/:id', productsController.destroy); 

module.exports = router
