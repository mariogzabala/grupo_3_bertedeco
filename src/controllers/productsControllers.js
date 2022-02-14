const fs = require('fs')

let productsController = {
    detail: function(req, res) { /* SE ESPECIFICA LA RUTA /products/deatil/productid */
        let prodId = req.params.productid
        let prodPath = `./products/${prodId}`
        if (fs.existsSync(prodPath)) {
            res.render(prodPath)
        } else {
            res.render('error')
        }  
    },

    list: function(req, res) {
        res.render('./products/productList')
    },

    admin: function(req, res) {
        res.render('./products/adminProducts')
    }
}

module.exports = productsController
