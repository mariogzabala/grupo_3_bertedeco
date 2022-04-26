const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const db = require('../database/models')

let adminController = {
    /* Mostrar el formulario de login */
    loginAdmin: function(req, res) {
        res.render('./admin/login', {error: false, newUser: false})
    },

    test: function(req, res) {
        db.AdminUsers.findAll({
            include: ['adminUserType'],
        })
        .then(function(admins){
            return res.send(admins)
        })
    },
    /* Autenticar usuario */
    authentication: function(req, res) {

        /* felipeag */
        /* marioz */
        /* julianv */
        /* francys */

        db.AdminUsers.findOne({where: {email: req.body.email}})
            .then(function(admin) {

                if (!admin) {
                    /* Se envia un mensaje de error si no se encuentra el usuario*/
                    return res.render('./admin/login', {error: true, newUser: false})
                }

                if (bcrypt.compareSync(req.body.password, admin.password)) {
                    /* borrar informacion sensible para no pasarla a la session */
                    delete admin.password
                    delete admin.phone
                    delete admin.createdAt
                    delete admin.updatedAt
                    req.session.adminLogged = admin

                    /* Crear cookie */
                    if (req.body.remember) {
                        res.cookie("adminEmail", admin.email, { maxAge: 600000 * 144, httpOnly: true })
                    }

                    return res.redirect(`/admin/products${admin.id}`)

                } else {
                    /* Se envia un mensaje de error por contraseña incorrecta */
                    return res.render('./admin/login', {error: true, newUser: false})
                }
                
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