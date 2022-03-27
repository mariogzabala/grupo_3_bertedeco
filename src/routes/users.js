const express = require('express')
const router = express.Router()

const usersController = require('../controllers/usersControllers.js')

/* PUEDEN AGREGAR MIDELWARES COMO VALIDATOR SI LO DESEAN
TAMBIEN CREAR MODULOS PARA COOKIES O SESSION EN LA CARPETA modules */

/* POR FAVOR ESCRIBAN CODIGO BIEN BONITO Y COMENTARIOS */

/* Mostrar login page*/
router.get('/login', usersController.login)

/* Enviar y procesar email y password para login */
router.post('/auth', usersController.authentication)

/* Mostrar formulario de registro*/
router.get('/register', usersController.register)

/* Guardar usuario */
router.post('/register', usersController.store)

/* Mostrar perfil del usuario*/
router.get('/profile/:id?', usersController.profile) /* Borrar el ? */

/* Editar perfil del usuario*/
router.post('/profile/edit/main/:id', usersController.editmain)

/* Crear direccion para usuario*/
router.post('/profile/create/address/:id', usersController.createaddress)

/* Crear pago para usuario*/
router.post('/profile/create/payment/:id', usersController.createpayment)

/* Editar direccion del usuario*/
router.put('/profile/edit/address/:id/:add_id', usersController.editaddress)

/* Editar pago del usuario*/
router.put('/profile/edit/payment/:id/:pay_id', usersController.editpayment)

/* Eliminar direccion del usuario*/
router.delete('/profile/delete/address/:id/:add_id', usersController.deleteaddress)

/* Eliminar pago del usuario*/
router.delete('/profile/delete/payment/:id/:pay_id', usersController.deletepayment)

/* Editar contraseña del usuario*/
router.put('/profile/edit/pass/:id', usersController.editpass)

module.exports = router
