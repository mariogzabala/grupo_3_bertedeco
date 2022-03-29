const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')

/* Donde esta el JSON */
const usersFilePath = path.join(__dirname, '../database/usersDataBase.json')

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
        /* asdfg */
        /* bertedeco */

        let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'))
        
        for (let user of users) {
            if(user.email == req.body.email) {
                /* console.log(bcrypt.hashSync(req.body.password, 10)) */
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    /* borrar informacion sensible para no pasarla a la session */
                    delete user.password
                    delete user.phone
                    delete user.address_list
                    delete user.payment_list
                    req.session.userLogged = user

                    /* Crear cookie */
                    if (req.body.remember) {
                        /* let randomNumber = Math.random().toString()
                        randomNumber = randomNumber.substring(2, randomNumber.length) */
                        res.cookie("userEmail", user.email, { maxAge: 600000 * 144, httpOnly: true })
                    }

                    return res.redirect(`/users/profile/${user.id}`)
                } else {
                    /* Se envia un mensaje de error */
                    return res.render('./users/login', {error: true, newUser: false})
                }        
            break
            }
        }

        /* Se envia un mensaje de error */
        return res.render('./users/login', {error: true, newUser: false})
    },

    /* Cerrar sesión */
    logout: function(req, res) {
        res.clearCookie('userEmail')
        req.session.destroy()
        return res.redirect('/home')
    },

     /* Mostrar el formulario de registro */
    register: function(req, res) {
        let existe = false;
        
        res.render('./users/register', {existe: existe})
    },

    /* Guardar un usuario nuevo */
    store: function(req, res) {
        let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'))  
        
        let existe = true;        
        
        /*buscar el e-mail para saber que no esta registrado el usuario */
        for (let user of users){
            if (user.email == req.body.email) {
                return res.render('./users/register', {existe: existe})
            }
        }

        let new_user = {
            id: users[users.length-1].id + 1,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            category: "users",
            image: "",
            phone: "",
            address_list: [],
            payment_list: []
        }

        users.push(new_user);
        fs.writeFileSync(usersFilePath, JSON.stringify(users,null,' '))
        res.render ('./users/login', {error: false, newUser: true})
    },

    /* Mostrar el perfil del usuario */
    profile: function(req, res) {
        let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'))
        
        for (let user of users) {
            if (user.id == req.params.id) {
                return res.render('./users/profile', {user: user,  imgError: false, passError: false})
            }
        }
        res.render('error')
    },

    /* editar el perfil del usuario */
    editmain: function(req, res) {
        let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'))

        let idBuscado = req.params.id

        let userError
        
        /* Buscar el usuario por id y actualizar los datos */
        for (let user of users) {
            if (user.id == idBuscado) {
                user.first_name = req.body.first_name
                user.last_name = req.body.last_name
                user.phone = req.body.phone

                /* Si se subio imagen porque no es obligatorio */
                if (req.files !== null) {
                    let image = req.files.image
                    let name = image.name
                    let uniqName = 'User' + Date.now() + name
                    let extName = image.mimetype
                    
                    /* Si la imagen cumple con los requisitos se guarda */
                    if (imgList.includes(extName) && image.size <= 512000) {
                        
                        /* Borrar imagen anterior */
                        if (user.image != "") {
                            fs.unlinkSync(storepath + user.image)
                        }

                        image.mv(storepath + uniqName, (err) => {
                            if (err) {res.send(err)}
                        })

                        user.image = uniqName
                    
                    } else {
                        userError = user
                    } 
                }

                /* Actualiza la session con los nuevos valores */
                req.session.userLogged.first_name = user.first_name
                req.session.userLogged.last_name = user.last_name
                req.session.userLogged.image = user.image
                
            break

            }
        }

        /* Se sobre-escribe el JSON con el usuario editado*/
        fs.writeFileSync(usersFilePath, JSON.stringify(users,null,' '))

        if (userError) {
             /* Se envia un mensaje de error por no poder guardar la imagen*/
            return res.render('./users/profile', {user: userError, imgError: true, passError: false})
        } else {
            /* Si todo salio bien se muestra el perfil del usuario */
            res.redirect(`/users/profile/${idBuscado}`)
        }        
    },

    /* Crear direccion para usuario*/
    createaddress: function(req, res) {
        let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'))
        
        let idBuscado = req.params.id
        
        /* Buscar el usuario por id y actualizar los datos */
        for (let user of users) {
            if (user.id == idBuscado) {
                /* se inicializa como nada (undefined) */
                let address_id
                /* Miramos si hay al menos una direccion */
                if (user.address_list.length > 0) {
                    /* Si hay, pasamos el id de la direccion que sera creada */
                    address_id = user.address_list[user.address_list.length-1].address_id + 1
                } else {
                    address_id = 1 /* No hay, empezamos en 1 */
                }

                let newAddress = {
                    address_id: address_id,
                    place: req.body.place,
                    address: req.body.address,
                    neighborhood: req.body.neighborhood,
                    zipcode: req.body.zipcode,
                    country: req.body.country,
                    estate: req.body.estate
                }

                user.address_list.push(newAddress)
                
            break

            }
        }

        /* Se sobre-escribe el JSON con el usuario editado*/
        fs.writeFileSync(usersFilePath, JSON.stringify(users,null,' '))

        /* Si todo salio bien se muestra el perfil del usuario */
        res.redirect(`/users/profile/${idBuscado}`)
    },

     /* Crear pago para usuario*/
    createpayment: function(req, res) {
        let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'))
        
        let idBuscado = req.params.id
        
        /* Buscar el usuario por id y actualizar los datos */
        for (let user of users) {
            if (user.id == idBuscado) {
                /* se inicializa como nada (undefined) */
                let payment_id
                /* Miramos si hay al menos una tarjeta */
                if (user.payment_list.length > 0) {
                    /* Si hay, pasamos el id de la tarjeta que sera creada */
                    payment_id = user.payment_list[user.payment_list.length-1].payment_id + 1
                } else {
                    payment_id = 1 /* No hay, empezamos en 1 */
                }

                let newPayment = { /* Encriptar */
                    payment_id: payment_id,
                    name: req.body.name,
                    number: req.body.number,
                    date: req.body.date,
                    cvv: req.body.cvv
                }

                user.payment_list.push(newPayment)
                
            break

            }
        }

        /* Se sobre-escribe el JSON con el usuario editado*/
        fs.writeFileSync(usersFilePath, JSON.stringify(users,null,' '))

        /* Si todo salio bien se muestra el perfil del usuario */
        res.redirect(`/users/profile/${idBuscado}`)
    },

    /* Editar direccion del usuario*/
    editaddress: function(req, res) {
        let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'))
        
        let idBuscado = req.params.id

        let direcBuscada = req.params.add_id
        
        /* Buscar el usuario por id y actualizar los datos */
        for (let user of users) {
            if (user.id == idBuscado) {
                
                /* Buscar la direccion por id y actualizar los datos */
                for (let address of user.address_list) {
                    
                    if (address.address_id == direcBuscada) {
                        address.place = req.body.place
                        address.address = req.body.address
                        address.neighborhood = req.body.neighborhood
                        address.zipcode = req.body.zipcode
                        address.country = req.body.country
                        address.estate = req.body.estate
                    }
                }
                
            break

            }
        }

        /* Se sobre-escribe el JSON con el usuario editado*/
        fs.writeFileSync(usersFilePath, JSON.stringify(users,null,' '))

        /* Si todo salio bien se muestra el perfil del usuario */
        res.redirect(`/users/profile/${idBuscado}`)
    },

    /* Editar pago del usuario*/
    editpayment: function(req, res) {
        let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'))
        
        let idBuscado = req.params.id

        let payBuscada = req.params.pay_id
        
        /* Buscar el usuario por id y actualizar los datos */
        for (let user of users) {
            if (user.id == idBuscado) {
                
                /* Buscar la tarjeta por id y actualizar los datos */
                for (let payment of user.payment_list) {
                    
                    if (payment.payment_id == payBuscada) { /* Encriptar */
                        payment.name = req.body.name
                        payment.number = req.body.number
                        payment.date = req.body.date
                        payment.cvv = req.body.cvv
                    }
                }
                
            break

            }
        }

        /* Se sobre-escribe el JSON con el usuario editado*/
        fs.writeFileSync(usersFilePath, JSON.stringify(users,null,' '))

        /* Si todo salio bien se muestra el perfil del usuario */
        res.redirect(`/users/profile/${idBuscado}`)
    },

    /* Elimina direccion del usuario*/
    deleteaddress: function(req, res) {
        let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'))
        
        let idBuscado = req.params.id

        let direcBuscada = req.params.add_id
        
        /* Buscar el usuario por id y actualizar los datos */
        for (let user of users) {
            if (user.id == idBuscado) {

                /* Con filter se obtiene una nueva variable con todos las direcciones menos la eliminada */
                let addressUpdate = user.address_list.filter(function(item) {
                    return item.address_id != direcBuscada
                })

                user.address_list = addressUpdate
                
            break

            }
        }

        /* Se sobre-escribe el JSON con el usuario editado*/
        fs.writeFileSync(usersFilePath, JSON.stringify(users,null,' '))

        /* Si todo salio bien se muestra el perfil del usuario */
        res.redirect(`/users/profile/${idBuscado}`)
    },

    /* Elimina pago del usuario*/
    deletepayment: function(req, res) {
        let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'))
        
        let idBuscado = req.params.id

        let payBuscada = req.params.pay_id

        /* Buscar el usuario por id y actualizar los datos */
        for (let user of users) {
            if (user.id == idBuscado) {

                /* Con filter se obtiene una nueva variable con todos las tarjetas menos la eliminada */
                let paymentUpdate = user.payment_list.filter(function(item) {
                    return item.payment_id != payBuscada
                })

                user.payment_list = paymentUpdate
                
            break

            }
        }

        /* Se sobre-escribe el JSON con el usuario editado*/
        fs.writeFileSync(usersFilePath, JSON.stringify(users,null,' '))

        /* Si todo salio bien se muestra el perfil del usuario */
        res.redirect(`/users/profile/${idBuscado}`)
    },

    /* Editar contraseña del usuario*/
    editpass: function(req, res) {
        let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'))
        
        let idBuscado = req.params.id
        
        /* Buscar el usuario por id y actualizar los datos */
        for (let user of users) {
            if (user.id == idBuscado) {
                
                /* hacer todo lo del cifrado */
                /* Se actualiza la contraseña si se logra validar la antigua */
        
                if (bcrypt.compareSync(req.body.oldpass, user.password)) {
                    user.password = bcrypt.hashSync(req.body.newpass, 10)
                } else {
                    /* Se envia un mensaje de error */
                    return res.render('./users/profile', {user: user, imgError: false, passError: true})
                }
                
            break

            }
        }

        /* Se sobre-escribe el JSON con el usuario editado*/
        fs.writeFileSync(usersFilePath, JSON.stringify(users,null,' '))

        /* Si todo salio bien se muestra el perfil del usuario */
        res.redirect(`/users/profile/${idBuscado}`)
    }

}

module.exports = userController
