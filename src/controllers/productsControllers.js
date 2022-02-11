let productsController = {
    detail: function(req, res) { /* SE ESPECIFICA LA RUTA /products/deatil/productid */
        let prodId = req.params.productid
        if ( prodId === undefined) {
            res.send("Producto No encontrado")
        } else {
            let prodPath = `./products/${prodId}`
            res.render(prodPath)
        }  
    },

    list: function(req, res) {
        res.render('./products/productList')
    },

    admin: function(req, res) {
        res.render('./products/adminProducts')
    },

    empty: function(req, res) {
        res.send("Producto No encontrado")
    }
}

module.exports = productsController