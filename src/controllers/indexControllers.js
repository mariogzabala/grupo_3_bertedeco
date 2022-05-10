const db = require('../database/models') /* Mover a cada metodo por si no recarga */

let indexController = {
    home: function(req, res) {
        
        /* Trae todos los porductos de la base de datos */
        db.Products.findAll({
            include: [{association: 'images'}, {association: 'discount'}],
            order: [['images', 'id', 'ASC']] /* Ordena las imagenes de forma ascendente */
        })
        .then(function(products) {
            return res.render('index', {productos: products})
        }).catch (err => {
            return res.redirect('error')
        })
        
    }

}

module.exports = indexController
