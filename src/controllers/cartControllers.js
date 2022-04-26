const db = require('../database/models') /* Mover a cada metodo por si no recarga */

let cartController = {
    resume: function(req, res) {
        db.Carts.findAll({
            include: [{association: 'user'}, {association: 'cartItems'}],    
        })
        .then(function(cart) {
            return res.send(cart)
        })
        /*res.render('./cart/productCart')*/
    },
}
module.exports = cartController
