const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')

/* Donde esta el JSON */
const usersFilePath = path.join(__dirname, '../database/usersDataBase.json')

/* Donde se guardan las imagenes */
const storepath = path.join(__dirname, '../../public/img/users/')

/* Los tipos de archivos aceptados */
const imgList = ['image/png', 'image/jpeg']

/* POR FAVOR ESCRIBAN CODIGO BIEN BONITO Y COMENTARIOS */

let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8')) /* usen esto donde lo necesiten */

let userController = {
    login: function(req, res) {
        /* Mostrar el formulario de login */
        res.render('./users/login')
    },

    authentication: function(req, res) {
        /* Recibe el email y el password por body
        Se busca en el json el email, si se encuentra se
        Comparan las contraseñas, si coinciden se da acceso,
        De lo contrario se devuelve un mensaje indicando el error.
        Al acceder se redirecciona a un pagina con un mensaje de exito
        desde donde se puede acceder al resto del sitio web
        TENER EN CUENTA LO DE LAS COOKIES O SESSION*/
    },

    register: function(req, res) {
        /* Mostrar el formulario de registro */
        let existe = false;
        
        res.render('./users/register', {existe: existe})
    },

    store: function(req, res) {
        /* Hacer practicamente todo el proceso de crear el usario imitando
        lo que se hizo en crear producto. Tener en cuenta no crear un usario si
        ya esta registrado el email, devolver un mensaje de error indicando esto
        cifrar la contraseña, hacer el proceso de las cookies o session
        si se tiene exito redireccionar a la pagina de perfil del usuario */
    /*buscar el e-mail para saber que no esta registrado el usuario */
        let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'))  
        let existe = true;        
        for (let user of users){
            if (user.email == req.body.email) {
                return res.render('./users/register', {existe: existe})
            }
        }
        let new_user = {
            id: users[users.length-1].id + 1,
            first_name:req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            category: "users",
            image:""
        }

        users.push(new_user);
        fs.writeFileSync(usersFilePath, JSON.stringify(users,null,' '))
        res.redirect ('/users/login')

        console.log (req.body)
    },


    profile: function(req, res) {
        /* Mostrar el perfil del usuario */
        let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'))
        res.render('./users/profile')
    },

    edit: function(req, res) {
        /* editar el perfil del usuario */
        let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'))
        res.render('./users/profile')
    }

}

module.exports = userController
