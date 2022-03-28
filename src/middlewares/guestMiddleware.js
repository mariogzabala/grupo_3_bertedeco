/* Redirecciona a perfil en caso de haber iniciado sesión */
function guestMiddleware(req, res, next) {
    let logged = req.session.userLogged
    if (logged) {
        return res.redirect(`/users/profile/${logged.id}`)
    }
    next()

}

module.exports = guestMiddleware
