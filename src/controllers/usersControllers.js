const fs = require('fs')
const path = require('path')

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
        res.render('./users/register')
    },

    store: function(req, res) {
        /* Hacer practicamente todo el proceso de crear el usario imitando
        lo que se hizo en crear producto. Tener en cuenta no crear un usario si
        ya esta registrado el email, devolver un mensaje de error indicando esto
        cifrar la contraseña, hacer el proceso de las cookies o session
        si se tiene exito redireccionar a la pagina de perfil del usuario */
    },

    profile: function(req, res) {
        /* Mostrar el perfil del usuario */
        let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'))
        
        for (let user of users) {
            if (user.id == req.params.id) {
                return res.render('./users/profile', {user: user,  imgError: false, passError: false})
            }
        }
        res.render('error')
    },

    editmain: function(req, res) {
        /* editar el perfil del usuario */
        let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'))

        let idBuscado = req.params.id
        
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
                        /* Se envia un mensaje de error */
                        userError = user
                        return res.render('./users/profile', {user: user, imgError: true, passError: false})
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

    createaddress: function(req, res) {
        /* Crear direccion para usuario*/
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

    createpayment: function(req, res) {
        /* Crear pago para usuario*/
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

    editaddress: function(req, res) {
        /* Editar direccion del usuario*/
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

    editpayment: function(req, res) {
        /* Editar pago del usuario*/
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

    deleteaddress: function(req, res) {
        /* Elimina direccion del usuario*/
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

    deletepayment: function(req, res) {
        /* Elimina pago del usuario*/
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

    editpass: function(req, res) {
        /* Editar contraseña del usuario*/
        let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'))
        
        let idBuscado = req.params.id
        
        /* Buscar el usuario por id y actualizar los datos */
        for (let user of users) {
            if (user.id == idBuscado) {
                
                /* hacer todo lo del cifrado */
                /* Se actualiza la contraseña si se logra validar la antigua */
                if (user.password == req.body.oldpass) {
                    user.password = req.body.newpass
                } else {
                    /* Se envia un mensaje de error */
                    userError = user
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
