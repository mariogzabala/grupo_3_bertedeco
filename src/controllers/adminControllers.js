const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const db = require('../database/models')

let adminController = {
    /* Mostrar el formulario de login */
    loginAdmin: function(req, res) {
        return res.render('./admin/login', {error: false, newUser: false})        
    },
    
    /* Autenticar usuario */
    authentication: function(req, res) {

        /* felipe@bertedeco.com - bertedeco*/
        /* mario@bertedeco.com - bertedeco*/
        /* julian@bertedeco.com* - bertedeco/
        /* francys@bertedeco.com - bertedeco*/

        db.AdminUsers.findOne({where: {email: req.body.email}})
            .then(function(admin) {

                if (!admin) {
                    /* Se envia un mensaje de error si no se encuentra el usuario*/
                    return res.render('./admin/login', {error: true, newUser: false})
                }

                if (bcrypt.compareSync(req.body.password, admin.password)) {
                    /* borrar informacion sensible para no pasarla a la session */
                    delete admin.dataValues.password
                    req.session.adminLogged = admin

                    /* Crear cookie */
                    if (req.body.remember) {
                        res.cookie("adminEmail", admin.email, { maxAge: 600000 * 144, httpOnly: true })
                    }

                    return res.redirect('/products/create')

                } else {
                    /* Se envia un mensaje de error por contraseña incorrecta */
                    return res.render('./admin/login', {error: true, newUser: false})
                }
                
            }).catch (err => {
                return res.render('error')
            })
        
    },

    /* Cerrar sesión */
    logoutAdmin: function(req, res) {
        res.clearCookie('adminEmail')
        req.session.destroy()
        return res.redirect('/admin')
    },
}    
    
module.exports = adminController
