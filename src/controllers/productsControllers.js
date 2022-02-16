const fs = require('fs')
const path = require('path')

let productsController = {
    detail: function(req, res) {
        let prodId = req.params.id /* id del producto */
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

    create: function(req, res) {
        res.render('./products/createProduct')
    },

    store: function(req, res) {
        res.render('error')
    },

    edit: function(req, res) {
        res.render('./products/editProduct')
    },

    update: function(req, res) {
        res.render('error')
    },

    destroy: function(req, res) {
        res.render('error')
    }
}

module.exports = productsController
