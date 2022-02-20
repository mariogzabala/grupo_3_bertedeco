const fs = require('fs')
const path = require('path')

const productsFilePath = path.join(__dirname, '../database/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

let productsController = {

    /* Lista de productos */
    list: function(req, res) {
        res.render('./products/productList', {productos: products})
    },
    
    /* Detalle de producto */
    detail: function(req, res) {
        let idProductoSeleccionado = req.params.id
        let productoEncontrado = null

        for (let p of products){
            if (p.id == idProductoSeleccionado){
                productoEncontrado = p
                break
            }
        }

        res.render('./products/productDetail', {productos: products, producto: productoEncontrado})
    },

    /* Mostrar formulario crear producto */
    create: function(req, res) {
        let idNuevo = products[products.length-1].id + 1;

        res.render('./products/createProduct', {idNuevo: idNuevo})
    },

    /* Guardar producto desde crear */
    store: function(req, res) {
        res.render('error')
    },

    /* Mostrar formulario editar producto */
    edit: function(req, res) {
        /* let idProductoSeleccionado = req.query.id
        console.log(idProductoSeleccionado) */
        res.render('./products/editProduct')
    },

    /* Actualizar producto desde editar */
    update: function(req, res) {
        res.render('error')
    },

    /* Eliminar producto desde editar */
    destroy: function(req, res) {
        res.render('error')
    }
}

module.exports = productsController
