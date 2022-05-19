const express = require('express')
const router = express.Router()

const usersController = require('../controllers/usersControllers.js')
const guestMiddleware = require('../middlewares/guestMiddleware.js')
const authMiddleware = require('../middlewares/authMiddleware.js')

/* Mostrar login page*/
router.get('/login', guestMiddleware, usersController.login)

/* Enviar y procesar email y password para login */
router.post('/auth', usersController.authentication)

/* Cerrar sesión */
router.get('/logout', usersController.logout)

/* Mostrar formulario de registro*/
router.get('/register', guestMiddleware, usersController.register)

/* Guardar usuario */
router.post('/register', usersController.store)

/* Mostrar perfil del usuario*/
router.get('/profile/:id?', authMiddleware, usersController.profile)

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

/* Api lista de usuarios*/
router.get('/api/users', usersController.apiusers)

/* Api Detalle de usuario*/
router.get('/api/users/:id', usersController.apiusersid)

module.exports = router
