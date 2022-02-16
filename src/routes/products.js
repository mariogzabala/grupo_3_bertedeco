const express = require('express')
const router = express.Router()

const productsController = require('../controllers/productsControllers.js')

/* Lista de productos */
router.get('/', productsController.list)

/* Detalle de producto */
router.get('/detail/:id?', productsController.detail)

/* Mostrar formulario */
router.get('/create', productsController.create)

/* Guardar porducto */
router.post('/create', productsController.store)

/* Mostrar formulario a editar */
router.get('/edit/:id?', productsController.edit); 

/* Modificar producto */
router.put('/edit/:id?', productsController.update);

/* Elimiar producto desde formulari de edicion*/
router.delete('/delete/:id?', productsController.destroy); 

module.exports = router
