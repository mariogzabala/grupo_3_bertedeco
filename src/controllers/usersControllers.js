let userController = {
    login: function(req, res) { /* SE ESPECIFICA LA RUTA /users/register */
        res.render('./users/login')
    },

    register: function(req, res) { /* SE ESPECIFICA LA RUTA /users/register */
        res.render('./users/register')
    },

    profile: function(req, res) { /* SE ESPECIFICA LA RUTA /users/register */
        res.render('./users/profile')
    }

}

module.exports = userController
