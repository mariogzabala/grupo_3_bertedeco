const fs = require('fs')
const path = require('path')

let productsController = {
    detail: function(req, res) {
        let prodId = req.params.productid /* id del producto */
        let prodPath = `./products/${prodId}` /* ruta a renderizar */
        let relativePath = `../views/${prodPath}.ejs` /* ruta relativa a comprobar */
        /* si la ruta relativa existe (si el archivo existe), se renderiza */
        if (fs.existsSync(path.join(__dirname, relativePath))) {
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
