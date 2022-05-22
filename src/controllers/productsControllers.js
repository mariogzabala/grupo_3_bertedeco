const fs = require('fs')
const path = require('path')
const db = require('../database/models')
const Sequelize = require('sequelize')
const { Op } = require("sequelize")

/* Donde se guardan las imagenes */
const storepath = path.join(__dirname, '../../public/img/productos/')

/* Los tipos de archivos aceptados */
const imgList = ['image/png', 'image/jpeg']

let productsController = {

    /* Lista de productos */
    list: function(req, res) {

        let wanted = '%'
        
        if (req.query.find) {
            wanted = '%' + req.query.find + '%'
        }
        
        /* Trae todos los productos de la db que esten activos y coincidan con la busqueda*/
        db.Products.findAll({
            where: { 
                [Op.or] : {
                    name: {[Op.like]: wanted},
                    category: {[Op.like]: wanted},
                    sku: {[Op.like]: wanted}
                },
                active: true
            },
            include: [{association: 'images'}, {association: 'discount'}],
            order: [['images', 'id', 'ASC']] /* Ordena las imagenes de forma ascendente */
        })
        .then(function(products) {
            /* Renderiza la lista de productos pasandole la db completa*/
            return res.render('./products/productList', {productos: products})
        }).catch (err => {
            return res.render('error')
        })

    },
    
    /* Detalle de producto */
    detail: async function(req, res) {
        
        try {
            /* Trae el producto deseado buscandolo por id */
            let product = await db.Products.findByPk(req.params.id, {
                include: [{association: 'images'}, {association: 'discount'}],
                order: [['images', 'id', 'ASC']] /* Ordena las imagenes de forma ascendente */
            })

            /* Esperamos a encontrar el producto */
            /* Trae todos los porductos de la base de datos que sean de la misma categoria*/
            db.Products.findAll({
                where: {id: {[Op.ne]: product.id}, category: product.category, active: true},
                include: [{association: 'images'}, {association: 'discount'}],
                order: [['images', 'id', 'ASC']] /* Ordena las imagenes de forma ascendente */
            })
            .then(function(products) {
                /* Se renderiza el detalle pasandole el producto deseado y todos los productos para las tarjetas de "TE PUEDE INTERESAR" */
                return res.render('./products/productDetail', {productos: products, producto: product})
            }).catch (err => {
                return res.render('error')
            })

        } catch (err) {
            return res.render('error')
        }

    },

    /* Mostrar formulario crear producto */
    create: function(req, res) {
        
        try {
            /* Trae todos los porductos de la base de datos */
            let findProducts = db.Products.findAll({
                include: [{association: 'images'}, {association: 'discount'}],
                order: [['id', 'ASC']] /* Ordena los productos de forma ascendente */
            })

            /* Trae todos los descuentos de la base de datos */
            let findDiscounts = db.Discounts.findAll({order: [['id', 'ASC']]})

            /* Esperamos a que las dos busquedas se cumplan para renderizar la vista */
            Promise.all([findProducts, findDiscounts])
                .then(function([products, discounts]) {
                    /* Miramos si hay al menos un producto en la db */
                    if (products !== null) {
                        let newId = products[products.length-1].id + 1
                        /* Se renderiza crear producto pasandole la id del producto que sera creado*/
                        return res.render('./products/createProduct', {idNuevo: newId, discounts: discounts, existe: false})
                    } else {
                        /* Si no hay, pasamos el id del producto que sera creado */
                        return res.render('./products/createProduct', {idNuevo: 1, discounts: discounts, existe: false})
                    }
                }).catch (err => {
                    return res.render('error')
                })
        } catch (err) {
            return res.render('error')
        }

    },

    /* Guardar producto desde crear */
    store: function(req, res) {

        /* Del formulario (body) creamos un nuevo producto (objeto)*/
        let newProduct = {
            id: parseInt(req.body.id), /* parseInt transforma de texto a numero */
            sku: `000${req.body.id}`,
            name: req.body.name,
            price: parseInt(req.body.price.replace(/\D+/g, "")), /* Elimina todo lo que no sean digitos */
            category: req.body.category,
            prod_desc: req.body.prod_desc,
            stock: parseInt(req.body.stock.replace(/\D+/g, "")),
            delivery: req.body.delivery,
            active: req.body.active,
            discount_id: req.body.discount_id,
        }

        /* Guardar el nuevo producto en la db*/
        db.Products.create(newProduct).then(function(product){

            /* Aqui guardaremos los archivos que no sean aceptados */
            let notSave = []

            /* Aqui pondremos la imagens para recorrelas mas adelante */
            let images = []

            /* Si solo hay una imagen la agregamos a images */
            if (!Array.isArray(req.files.images)) {
                images.push(req.files.images)
            } else {
                /* Si hay varias imagenes, estas seran la varible images (es diferente a hacer push) */
                images = req.files.images
            }

            /* Recorremos las imagenes para guardarlas una a una */
            for (let image of images) {
                let name = image.name
                let uniqName = 'Prod' + Date.now() + name /* Nombre unico de la foto con fecha actual */
                let extName = image.mimetype /* Tipo de archivo (.jpg .png .pdf .doc etc) */
                
                /* Si la imagen es del tipo que queremos y pesa menos de 500 kb, se guarda*/
                if (imgList.includes(extName) && image.size <= 512000) {
                    
                    /* Guarda cada imagen en la db */
                    db.ProdImages.create(
                        {
                            name: uniqName,
                            product_id: product.id
                        }
                    ).then(function(curImage){
                        /* Guardamos en la carpeta public/img/productos */
                        image.mv(storepath + curImage.name, (err) => {
                            if (err) {res.send(err)}
                        })
                    }).catch (err => {
                        return res.render('error')
                    })
                    
                } else {
                    /* Si no es aceptado se agrega a este array */
                    notSave.push(name)
                }
            }

            if (notSave.length > 0) {
                /* Si hay archivos no guardados se pasan a editar producto para ser mostrados */
                /* Trae el producto deseado buscandolo por id */
                let findProduct = db.Products.findByPk(product.id, {
                    include: [{association: 'images'}, {association: 'discount'}],
                    order: [['images', 'id', 'ASC']] /* Ordena las imagenes de forma ascendente */
                })

                /* Trae todos los descuentos de la base de datos */
                let findDiscounts = db.Discounts.findAll({order: [['id', 'ASC']]})

                /* Esperamos a que las dos busquedas se cumplan para renderizar la vista */
                Promise.all([findProduct, findDiscounts])
                    .then(function([productForEdit, discounts]) {
                        /* Si hay archivos no guardados se pasan a editar producto para ser mostrados */
                        return res.render('./products/editProduct', {producto: productForEdit, discounts: discounts, noguardado: notSave})
                    }).catch (err => {
                        return res.render('error')
                    })
            } else {
                /* Si todo salio bien se muestra el detalle del producto creado */
                return res.redirect(`/products/detail/${product.id}`)
            }

        }).catch (err => {
            return res.render('error')
        })

        /* sharp opcional para comprimir imagenes*/
    },

    /* Mostrar formulario editar producto */
    edit: function(req, res) {

        try {
            /* Trae el producto deseado buscandolo por id */
            let findProduct = db.Products.findByPk(req.query.id, {
                include: [{association: 'images'}, {association: 'discount'}],
                order: [['images', 'id', 'ASC']] /* Ordena las imagenes de forma ascendente */
            })

            /* Trae todos los descuentos de la base de datos */
            let findDiscounts = db.Discounts.findAll({order: [['id', 'ASC']]})

            /* Esperamos a que las dos busquedas se cumplan para renderizar la vista */
            Promise.all([findProduct, findDiscounts])
                .then(function([product, discounts]) {
                    /* Se renderiza editar producto pasandole el producto (vacio o con valores, esto depende de si lo encontramos o no)
                    tambien pasamos la busqueda que se hizo y el array vacio de no guardados (necesario)*/
                    return res.render('./products/editProduct', {producto: product, discounts: discounts, busqueda: req.query.id, noguardado: []})
                }).catch (err => {
                    return res.render('error')
                })
        } catch (err) {
            return res.render('error')
        }

    },

    /* Actualizar producto desde editar */
    update: function(req, res) {

        /* Del formulario (body) actualizamos un producto (objeto)*/
        let updatedProduct = {
            name: req.body.name,
            price: parseInt(req.body.price.replace(/\D+/g, "")), /* Elimina todo lo que no sean digitos */
            category: req.body.category,
            prod_desc: req.body.prod_desc,
            stock: parseInt(req.body.stock.replace(/\D+/g, "")),
            delivery: req.body.delivery,
            active: req.body.active,
            discount_id: req.body.discount_id,
        }

        try {
            /* Guardar el nuevo producto en la db*/
            let updateProduct = db.Products.update(updatedProduct, {where: {id: req.params.id}})

            /* Encontrar las imagenes para borrar */
            let findImages = db.ProdImages.findAll({where: {product_id: req.params.id}}, {order: [['id', 'ASC']]})

            /* Esperamos a que las dos operaciones se cumplan para eliminar y agregar las imagenes */
            Promise.all([updateProduct, findImages])
                .then(function([product, prodImages]) {

                    /* Aqui guardaremos los archivos que no sean aceptados */
                    let notSave = []

                    /* Aqui pondremos la imagens para recorrelas mas adelante */
                    let images = []

                    /*borrar imagenes*/
                    for( let index = 0; index < prodImages.length; index++ ) {
                        let image = 'delete-image-' + index
                
                        if (req.body[image]){
                            db.ProdImages.destroy({where: {id: req.body[image]}})
                                .then(function() {
                                    fs.unlinkSync(storepath + prodImages[index].name)
                                }).catch (err => {
                                    return res.render('error')
                                })
                        }
                    }
                    
                    if (req.files !== null && !Array.isArray(req.files.images)) {
                        images.push(req.files.images)
                    } else if (req.files !== null && Array.isArray(req.files.images)) {
                        images = req.files.images
                    }

                    /* Si se subio una imagen (porque en editar no es obligatoria) */
                    if (req.files !== null) {
                        for (let image of images) {
                            let name = image.name
                            let uniqName = 'Prod' + Date.now() + name /* Nombre unico de la foto con fecha actual */
                            let extName = image.mimetype /* Tipo de archivo (.jpg .png .pdf .doc etc) */
                            
                            /* Si la imagen es del tipo que queremos y pesa menos de 500 kb, se guarda*/
                            if (imgList.includes(extName) && image.size <= 512000) {
                                
                                /* Guarda cada imagen en la db */
                                db.ProdImages.create(
                                    {
                                        name: uniqName,
                                        product_id: req.params.id
                                    }
                                ).then(function(curImage){
                                    /* Guardamos en la carpeta public/img/productos */
                                    image.mv(storepath + curImage.name, (err) => {
                                        if (err) {res.send(err)}
                                    })
                                }).catch (err => {
                                    return res.render('error')
                                })
                                
                            } else {
                                /* Si no es aceptado se agrega a este array */
                                notSave.push(name)
                            }
                        }

                    }

                    if (notSave.length > 0) {
                        /* Si hay archivos no guardados se pasan a editar producto para ser mostrados */
                        /* Trae el producto deseado buscandolo por id */
                        let findProduct = db.Products.findByPk(req.params.id, {
                            include: [{association: 'images'}, {association: 'discount'}],
                            order: [['images', 'id', 'ASC']] /* Ordena las imagenes de forma ascendente */
                        })
        
                        /* Trae todos los descuentos de la base de datos */
                        let findDiscounts = db.Discounts.findAll({order: [['id', 'ASC']]})
        
                        /* Esperamos a que las dos busquedas se cumplan para renderizar la vista */
                        Promise.all([findProduct, findDiscounts])
                            .then(function([productForEdit, discounts]) {
                                /* Si hay archivos no guardados se pasan a editar producto para ser mostrados */
                                return res.render('./products/editProduct', {producto: productForEdit, discounts: discounts, noguardado: notSave})
                            }).catch (err => {
                                return res.render('error')
                            })
                    } else {
                        /* Si todo salio bien se muestra el detalle del producto creado */
                        return res.redirect(`/products/detail/${req.params.id}`)
                    }

                }).catch (err => {
                    return res.render('error')
                })
        } catch (err) {
            return res.render('error')
        }

        /* sharp opcional para comprimir imagenes*/
    },

    /* Eliminar producto desde editar */
    destroy: async function(req, res) {
        
        try {
            /* Encontrar las imagenes para borrar */
            let images = await db.ProdImages.findAll({where: {product_id: req.params.id}}, {order: [['id', 'ASC']]})

            /* Esperamos encontrar las imagenes para borrarlas */
            for( let image of images ) {
                db.ProdImages.destroy({where: {id: image.id}})
                    .then(function(deleted) {
                        fs.unlinkSync(storepath + image.name)
                    }).catch (err => {
                        return res.render('error')
                    })
            }

            /* Despues de borrar todas las imagenes, borramos el producto */
            db.Products.destroy({where: {id: req.params.id}})
                .then(function() {
                    return res.redirect('/products/')
                }).catch (err => {
                    return res.render('error')
                })
        } catch (err) {
            return res.render('error')
        }

    },

    /* Mostrar descuentos */
    discounts: function(req, res) {

        /* Trae todos los descuentos de la base de datos */
        db.Discounts.findAll({where: {id: {[Op.ne]: 1}}}, {order: [['id', 'ASC']]})
            .then(function(discounts) {
                /* Miramos si hay al menos un descuento en la db */
                if (discounts !== null) {
                    let newId = discounts[discounts.length-1].id + 1
                    /* Se renderiza los descuentos pasandole la id del descuento que sera creado*/
                    return res.render('./products/discounts', {newId, discounts})
                } else {
                    /* Si no hay, pasamos el id del descuento que sera creado */
                    return res.render('./products/discounts', {newId: 2, discounts})
                }
            
            }).catch (err => {
                return res.render('error')
            })

    },

    /* Crear descuento */
    creatediscount: function(req, res) {

        let newDiscount = {
            id: req.params.id,
            name: req.body.name,
            desc: req.body.desc,
            percent: parseInt(req.body.percent.replace(/\D+/g, "")),
            active: req.body.active
        }

        db.Discounts.create(newDiscount)
            .then(function() {
                return res.redirect('/products/discounts')
            }).catch (err => {
                return res.render('error')
            })

    },

    /* Actualizar descuento */
    editdiscount: function(req, res) {

        let updatedDiscount = {
            name: req.body.name,
            desc: req.body.desc,
            percent: parseInt(req.body.percent.replace(/\D+/g, "")),
            active: req.body.active
        }

        db.Discounts.update(updatedDiscount, {where: {id: req.params.id}})
            .then(function() {
                return res.redirect('/products/discounts')
            }).catch (err => {
                return res.render('error')
            })

    },

    /* Eliminar descuento */
    deletediscount: async function(req, res) {

        try {
            /* Cambiar a sin descuento en todos los productos que tengan el descuento a eliminar */
            let updateProducts = await db.Products.update({discount_id: 1}, {where: {discount_id: req.params.id}})

            db.Discounts.destroy({where: {id: req.params.id}})
                .then(function() {
                    return res.redirect('/products/discounts')
                }).catch (err => {
                    return res.render('error')
                })
        } catch (err) {
            return res.render('error')
        }

    },

    /* Api lista de productos */
    apiproducts: function(req, res) {

        let countByCategory
        
        db.Products.findAll({
            where: {active: true},
            group: ['category'],
            attributes: ['category', [Sequelize.fn('COUNT', 'category'), 'count']],
            order: [[Sequelize.literal('count'), 'DESC']],
            raw: true,
        }).then(function(categories) {
            countByCategory = categories
        }).catch (err => {
            return res.status(400).json({
                status: 400,
                message: "Bad Request",
                errors: err                   
            })
        })

        db.Products.findAll({
            where: {active: true},
            include: [{association: 'images'}, {association: 'discount'}],
            order: [['id', 'ASC']] /* Ordena las imagenes de forma ascendente */
        }) 
        .then(function(products) {
            let productsList = []
            for (const product of products) {   
                let obj = {
                    id: product.id,
                    name: product.name,
                    stock: product.stock,
                    description: product.prod_desc,
                    category: product.category,
                    images: product.images,
                    detail: `https://bertedeco.herokuapp.com/products/detail/${product.id}`
                }
                productsList.push(obj)
            }
            return res.status(200).json({
                status: 200,
                message: "Product list Request was successfully",
                count: productsList.length,
                count_by_category: countByCategory,
                products: productsList
            })
            }).catch (err => {
                return res.status(400).json({
                    status: 400,
                    message: "Bad Request",
                    errors: err                   
                })
            })

    }, 

    /* Api detalle de producto */
    apiproductsid: function(req, res) {

        db.Products.findByPk(req.params.id, {
            include: [{association: 'images'}, {association: 'discount'}],
            order: [['images', 'id', 'ASC']] /* Ordena las imagenes de forma ascendente */
        })
        .then(function(product){
            let productDetail= {
                id: product.id,
                sku: product.sku,
                name: product.name,
                price: product.price,
                stock: product.stock,
                discount: product.discount,
                active: product.active,
                description: product.prod_desc,
                category: product.category,
                delivery: product.delivery,
                image: `https://bertedeco.herokuapp.com/img/productos/${product.images[0].name}`,
                images: product.images
            }
            return res.status(200).json({
                status: 200,
                description: "Product Request was successfully",
                data: productDetail
            })
        }).catch (err => {
            return res.status(400).json({
                status: 400,
                message: "Bad Request",
                errors: err                   
            })
        })

    }

}

module.exports = productsController
