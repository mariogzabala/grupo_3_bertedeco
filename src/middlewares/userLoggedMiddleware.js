const getUser = require('../models/getUser.js')

function loggedMiddleware(req, res, next) {
    res.locals.isLogged = false
    
    let emailCookie = req.cookies.userEmail
    let userCookie = getUser.findByField('email', emailCookie)

    /* Maintiene la sesión con los datos de la cookie */
    if (userCookie) {
        /* borrar informacion sensible para no pasarla a la session */
        delete userCookie.password
        delete userCookie.phone
        delete userCookie.address_list
        delete userCookie.payment_list
        req.session.userLogged = userCookie
    }

    let logged = req.session.userLogged

    /* Le pasa los datos del usuario a todo el sito web */
    if (logged) {
        res.locals.isLogged = true
        res.locals.user = logged
    }

    next()

}

module.exports = loggedMiddleware
