const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const db = require('../database/models')

/* Donde se guardan las imagenes */
const storepath = path.join(__dirname, '../../public/img/users/')

/* Los tipos de archivos aceptados */
const imgList = ['image/png', 'image/jpeg']

let userController = {
    /* Mostrar el formulario de login */
    login: function(req, res) {
        res.render('./users/login', {error: false, newUser: false})
    },

    /* Autenticar usuario */
    authentication: function(req, res) {

        /* felipeag */
        /* mario */
        /* julianv */
        /* francys */

        db.Users.findOne({where: {email: req.body.email}})
            .then(function(user) {

                if (!user) {
                    /* Se envia un mensaje de error si no se encuentra el usuario*/
                    return res.render('./users/login', {error: true, newUser: false})
                }

                if (bcrypt.compareSync(req.body.password, user.password)) {
                    /* borrar informacion sensible para no pasarla a la session */
                    delete user._previousDataValues
                    delete user.uniqno
                    delete user.isNewRecord
                    delete user.dataValues.password
                    delete user.dataValues.phone
                    delete user.dataValues.createdAt
                    delete user.dataValues.updatedAt
                    req.session.userLogged = user

                    /* Crear cookie */
                    if (req.body.remember) {
                        res.cookie("userEmail", user.email, { maxAge: 600000 * 144, httpOnly: true })
                    }

                    return res.redirect(`/users/profile/${user.id}`)

                } else {
                    /* Se envia un mensaje de error por contraseña incorrecta */
                    return res.render('./users/login', {error: true, newUser: false})
                }
                
            }).catch (err => {
                return res.render('error')
            })
        
    },

    /* Cerrar sesión */
    logout: function(req, res) {
        res.clearCookie('userEmail')
        req.session.destroy()
        return res.redirect('/home')
    },

    /* Mostrar el formulario de registro */
    register: function(req, res) {
        return res.render('./users/register', {existe: false})
    },

    /* Guardar un usuario nuevo */
    store: function(req, res) {

        db.Users.findOne({where: {email: req.body.email}})
            .then(function(user) {
                
                /* Verificarmos si el usuario ya esta registrado */
                if (user) {

                    /* Se envia un mensaje de error */
                    return res.render('./users/register', {existe: true})
                    
                } else {
                    
                    /* Se guarda el nuevo usuario */
                    let newUser = {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        email: req.body.email,
                        password: bcrypt.hashSync(req.body.password, 10),
                    }
            
                    db.Users.create(newUser)
                        .then(function(user) {
                            return res.render ('./users/login', {error: false, newUser: true})
                        }).catch (err => {
                            return res.render('error')
                        })
                }
            }).catch (err => {
                return res.render('error')
            })
  
    },

    /* Mostrar el perfil del usuario */
    profile: function(req, res) {

        db.Users.findOne({where: {id: req.params.id}, include: [{association: 'address_list'}, {association: 'payment_list'}]})
            .then(function(user) {
                return res.render('./users/profile', {user: user,  imgError: false, passError: false})
            }).catch (err => {
                return res.render('error')
            })

    },

    /* editar el perfil del usuario */
    editmain: async function(req, res) {

        let newData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone: req.body.phone,
        }

        try {
            /* Actualizar usuario */
            let updateUser = await db.Users.update(newData, {where: {id: req.params.id}})

            /* Buscar el usuario actualizado para devolver esos datos en caso de error */
            let user = await db.Users.findOne({where: {id: req.params.id}, include: [{association: 'address_list'}, {association: 'payment_list'}]})

            let userError

            /* Si se subio imagen porque no es obligatorio */
            if (req.files) {
                let image = req.files.image
                let name = image.name
                let uniqName = 'User' + Date.now() + name
                let extName = image.mimetype
        
                /* Si la imagen cumple con los requisitos se guarda */
                if (imgList.includes(extName) && image.size <= 512000) {

                    /* Actualiza la session con los nuevos valores */
                    req.session.userLogged.image = uniqName
                
                    /* Borrar imagen anterior */
                    if (user.image) {
                        fs.unlinkSync(storepath + user.image)
                    }
                    
                    /* Guardar archivo */
                    image.mv(storepath + uniqName, (err) => {
                        if (err) {res.send(err)}
                    })

                    /* Sin then y catch */
                    db.Users.update({image: uniqName}, {where: {id: req.params.id}})
            
                } else {
                    userError = user
                } 
            }

            /* Actualiza la session con los nuevos valores */
            req.session.userLogged.first_name = user.first_name
            req.session.userLogged.last_name = user.last_name
            
            if (userError) {
                /* Se envia un mensaje de error por no poder guardar la imagen*/
                return res.render('./users/profile', {user: userError, imgError: true, passError: false})
            } else {
                /* Si todo salio bien se muestra el perfil del usuario */
                return res.redirect(`/users/profile/${req.params.id}`)
            }
        } catch (err) {
            return res.render('error')
        }

    },

    /* Crear direccion para usuario*/
    createaddress: function(req, res) {

        let newAddress = {
            place: req.body.place,
            address: req.body.address,
            neighborhood: req.body.neighborhood,
            zipcode: req.body.zipcode,
            city: req.body.city,
            country: req.body.country,
            estate: req.body.estate,
            user_id: req.params.id,
        }

        db.UserAddresses.create(newAddress)
            .then(function() {
                return res.redirect(`/users/profile/${req.params.id}`)

            }).catch (err => {
                return res.render('error')
            })

    },

     /* Crear pago para usuario*/
    createpayment: function(req, res) {
    
        let newPayment = { /* Encriptar */
            owner: req.body.owner,
            number: req.body.number.replace(/\D+/g, ""),
            expiry_month: req.body.expiry_month,
            expiry_year: req.body.expiry_year,
            cvv: req.body.cvv,
            user_id: req.params.id,
        }

        db.UserPayments.create(newPayment)
            .then(function() {
                return res.redirect(`/users/profile/${req.params.id}`)

            }).catch (err => {
                return res.render('error')
            })

    },

    /* Editar direccion del usuario*/
    editaddress: function(req, res) {

        let updatedAddress = {
            place: req.body.place,
            address: req.body.address,
            neighborhood: req.body.neighborhood,
            zipcode: req.body.zipcode,
            city: req.body.city,
            country: req.body.country,
            estate: req.body.estate,
        }

        db.UserAddresses.update(updatedAddress, {where: {id: req.params.add_id}})
            .then(function() {
                return res.redirect(`/users/profile/${req.params.id}`)

            }).catch (err => {
                return res.render('error')
            })

    },

    /* Editar pago del usuario*/
    editpayment: function(req, res) {
        
        let updatedPayment = { /* Encriptar */
            owner: req.body.owner,
            number: req.body.number.replace(/\D+/g, ""),
            expiry_month: req.body.expiry_month,
            expiry_year: req.body.expiry_year,
            cvv: req.body.cvv,
        }

        db.UserPayments.update(updatedPayment, {where: {id: req.params.pay_id}})
            .then(function() {
                return res.redirect(`/users/profile/${req.params.id}`)

            }).catch (err => {
                return res.render('error')
            })
    },

    /* Elimina direccion del usuario*/
    deleteaddress: function(req, res) {

        db.UserAddresses.destroy({where: {id: req.params.add_id}})
            .then(function() {
                return res.redirect(`/users/profile/${req.params.id}`)

            }).catch (err => {
                return res.render('error')
            })
        
    },

    /* Elimina pago del usuario*/
    deletepayment: function(req, res) {
        
        db.UserPayments.destroy({where: {id: req.params.pay_id}})
            .then(function() {
                return res.redirect(`/users/profile/${req.params.id}`)

            }).catch (err => {
                return res.render('error')
            })
    },

    /* Editar contraseña del usuario*/
    editpass: function(req, res) {

        /* Se busca al usuario para comparar contraseña guardada y antigua(body) */
        db.Users.findOne({where: {id: req.params.id}, include: [{association: 'address_list'}, {association: 'payment_list'}]})
            .then(function(user) {
                
                /* Se actualiza la contraseña si se logra validar la antigua */

                if (bcrypt.compareSync(req.body.oldpass, user.password)) {
                    let newPassword = bcrypt.hashSync(req.body.newpass, 10)
                    db.Users.update({password: newPassword}, {where: {id: req.params.id}})
                        .then(function() {
                            /* Si todo salio bien se muestra el perfil del usuario */
                            return res.redirect(`/users/profile/${req.params.id}`)
                        }).catch (err => {
                            return res.render('error')
                        })
                    
                } else {
                    /* Se envia un mensaje de error */
                    return res.render('./users/profile', {user: user, imgError: false, passError: true})
                }

            }).catch (err => {
                return res.render('error')
            })

    },

    /* Api lista de usuarios */
    apiusers: function(req, res) {

        db.Users.findAll() 
            .then(function(users) {
                let userslist = []
                for(const user of users) {
                    let obj = {
                        id: user.id,
                        name:  user.first_name,
                        lastname: user.last_name,
                        email:  user.email,
                        detail: "url para ir a detalle"
                    }
                    userslist.push(obj)
                }
                return res.status(200).json({
                    status: 200,
                    message: "User list Request was successfully",
                    count: userslist.length,
                    users: userslist
                })    
            }).catch (err => {
                return res.status(400).json({
                    status: 400,
                    message: "Bad Request",
                    errors: err                   
                })
            })

    }, 

    /* Api del detalle de usuario */
    apiusersid: function(req, res) {

        db.Users.findByPk(req.params.id) 
            .then(function(user) {
                let userDetail = {
                    name:  user.first_name,
                    lastname: user.last_name,
                    email:  user.email,
                    image: "url de la imagen de perfil"
                }
                return res.status(200).json({
                    status: 200,
                    message: "User Request was successfully",
                    data: userDetail
                })
            }).catch (err => {
                return res.status(400).json({
                    status: 400,
                    message: "Bad Request",
                    errors: err                   
                })
            })

    }
    
}

module.exports = userController
