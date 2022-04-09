const db = require('../database/models')

function loggedMiddleware(req, res, next) {
    res.locals.isLogged = false
    
    let emailCookie = req.cookies.userEmail
    
    if (emailCookie) {
        
        db.Users.findOne({where: {email: emailCookie}})
            .then(function(userCookie) {
                /* Maintiene la sesión con los datos de la cookie */
                if (userCookie && req.session) {
                    /* borrar informacion sensible para no pasarla a la session */
                    delete userCookie.password
                    delete userCookie.phone
                    delete userCookie.createdAt
                    delete userCookie.updatedAt
                    req.session.userLogged = userCookie
                }
            })

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
