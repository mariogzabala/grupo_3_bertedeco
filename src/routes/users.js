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
router.post('/profile/edit/:id', usersController.edit)

module.exports = router
