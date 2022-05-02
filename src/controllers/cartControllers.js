const db = require('../database/models')
const { Op } = require("sequelize")

let cartController = {
    resume: function(req, res) {

        db.CartItems.findAll({
            where: {cart_id: 1},
            include: [{association: 'product'}, {association: 'cart'}],
            /* order: [['cart_items', 'id', 'ASC']] */
        })
        .then(function(items) {
           
            /* Traer de la base de datos cada producto de cada item con sus imagenes y descuento y pasarlos como array a la vista */
           /* 
           products_items = []
           for item of items {
               db.Products.findOne({
                   where: {id: item.product},
                   include: [{association: 'images'}, {association: 'discount'}],
                   order: [['images', 'id', 'ASC']]
               }).then(function(product) {
                   products_items.push(product)
               }

            res.render('./cart/productCart', {items, products_items})
           } */
            return res.send(items)
            /* res.render('./cart/productCart') */
            
        })

    }

}

module.exports = cartController
