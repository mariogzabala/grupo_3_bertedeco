/* Redirecciona a login en caso de no haber iniciado sesión */
function authMiddleware(req, res, next) {
    let logged = req.session.userLogged
    if (!logged || logged.id != req.params.id) {
        return res.redirect('/users/login')
    }
    next()

}

module.exports = authMiddleware
