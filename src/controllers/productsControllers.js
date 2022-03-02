const fs = require('fs')
const path = require('path')

const productsFilePath = path.join(__dirname, '../database/productsDataBase.json')
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'))
const storepath = path.join(__dirname, '../../public/img/productos/')
const imgList = ['image/png', 'image/jpeg']

let productsController = {

    /* Lista de productos */
    list: function(req, res) {
        
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'))
        res.render('./products/productList', {productos: products})
    },
    
    /* Detalle de producto */
    detail: function(req, res) {

        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'))
        let idProductoSeleccionado = req.params.id
        let productoEncontrado = null

        for (let p of products){
            if (p.id == idProductoSeleccionado) {
                productoEncontrado = p
                break
            }
        }

        res.render('./products/productDetail', {productos: products, producto: productoEncontrado})
    },

    /* Mostrar formulario crear producto */
    create: function(req, res) {

        let idNuevo
        
        if (products[products.length-1] === undefined) {
            idNuevo = 1
        } else {
            idNuevo = products[products.length-1].id + 1
        }

        res.render('./products/createProduct', {idNuevo: idNuevo})
    },

    /* Guardar producto desde crear Francys*/
    store: function(req, res) {

        let productoCreado = {
            id: parseInt(req.body.id),
            name: req.body.name,
            price: parseInt(req.body.price.replace(/[.,/#!$%^&*;:"{}=-_`~()' ]+/g, "")),
            discount: '',
            category: req.body.category,
            delivery: parseInt(req.body.delivery),
            description: req.body.description,
            image: []
        }

        let discount = req.body.discount.replace(/[.,/#!$%^&*;:"{}=-_`~()' ]+/g, "")

        if (!isNaN(discount) && !isNaN(parseFloat(discount))) {
            productoCreado.discount = parseInt(discount)                    
        }

        if (Array.isArray(req.files.foto)) {
            for (let image of req.files.foto) {
                let name = image.name
                let extName = image.mimetype
                if (imgList.includes(extName) && image.size <= 512000) {
                    productoCreado.image.push(name)
                    image.mv(storepath + name, (err) => {
                        if (err) {res.send(err)}
                    })
                }
            }
        } else {
            let image = req.files.foto
            let name = image.name
            let extName = image.mimetype
            if (imgList.includes(extName) && image.size <= 512000) {
                productoCreado.image.push(name)
                image.mv(storepath + name, (err) => {
                    if (err) {res.send(err)}
                })
            }
        }
        
        products.push(productoCreado);

        fs.writeFileSync(productsFilePath, JSON.stringify(products,null,' '))

        res.redirect(`/products/detail/${productoCreado.id}`)

        /* sharp opcional */
    },

    /* Mostrar formulario editar producto Mario*/
    edit: function(req, res) {

        let idProductoSeleccionado = req.query.id
        let productoEditado = {
            id: "",
            name: "",
            price: "",
            discount: "",
            category: "",
            delivery: "",
            description: "",
            image: []  
        }
        
        for (let item of products){
            if (item.id == idProductoSeleccionado) {
                productoEditado.id = item.id
                productoEditado.name = item.name
                productoEditado.price = item.price
                productoEditado.discount = item.discount
                productoEditado.category = item.category
                productoEditado.delivery = item.delivery
                productoEditado.description = item.description
                productoEditado.image = item.image                
                break
            }
        }

        res.render('./products/editProduct', {producto: productoEditado, busqueda: idProductoSeleccionado})
    },

    /* Actualizar producto desde editar Mario*/
    update: function(req, res) {

        const productoEditado = req.body
        const idBuscado = req.body.id
        let productosNuevos = products
        
        for(let item of productosNuevos) {
            if (item.id == idBuscado) {
                item.id = parseInt(productoEditado.id)
                item.name = productoEditado.name
                item.price = parseInt(productoEditado.price.replace(/[.,/#!$%^&*;:"{}=-_`~()' ]+/g, ""))
                let discount = productoEditado.discount.replace(/[.,/#!$%^&*;:"{}=-_`~()' ]+/g, "")
                if (!isNaN(discount) && !isNaN(parseFloat(discount))) {
                    item.discount = parseInt(discount)                   
                } else {
                    item.discount = ''
                }                 
                item.category = productoEditado.category
                item.delivery = parseInt(productoEditado.delivery)
                item.description = productoEditado.description
                item.image = item.image
                if (req.files !== null && Array.isArray(req.files.foto)) {
                    for (let image of req.files.foto) {
                        let name = image.name
                        let extName = image.mimetype
                        if (imgList.includes(extName) && image.size <= 512000) {
                            item.image.push(name)
                            image.mv(storepath + name, (err) => {
                                if (err) {res.send(err)}
                            })
                        }
                    }
                } else if (req.files !== null) {
                    let image = req.files.foto
                    let name = image.name
                    let extName = image.mimetype
                    if (imgList.includes(extName) && image.size <= 512000) {
                        item.image.push(name)
                        image.mv(storepath + name, (err) => {
                            if (err) {res.send(err)}
                        })
                    }
                }
                break
            }                
        }
       
        fs.writeFileSync(productsFilePath, JSON.stringify(productosNuevos,null,' '))       
        
        res.redirect(`/products/detail/${idBuscado}`)
    },

    /* Eliminar producto desde editar Julian*/
    destroy: function(req, res) {

        let eliminar = req.params.id
        let encontrado = null

        for (let item of products) {
            if (item.id == eliminar) {
                encontrado = item
                break
            }
        }

        let produtosNew = products.filter(function(item) {
            return item.id != encontrado.id
        })

        for (let image of encontrado.image) {
            fs.unlinkSync(storepath + image)
        }

        fs.writeFileSync(productsFilePath, JSON.stringify(produtosNew, null,' '))

        res.redirect('/products/') 
    }
}

module.exports = productsController
