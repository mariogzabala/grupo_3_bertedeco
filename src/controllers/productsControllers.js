const fs = require('fs')
const path = require('path')

/* Donde esta el JSON */
const productsFilePath = path.join(__dirname, '../database/productsDataBase.json')

/* Donde se guardan las imagenes */
const storepath = path.join(__dirname, '../../public/img/productos/')

/* Los tipos de archivos aceptados */
const imgList = ['image/png', 'image/jpeg']

let productsController = {

    /* Lista de productos */
    list: function(req, res) {
        
        /* Lee y guarda el JSON en esta variable cada vez que se abre la lista de productos,
        para tener todo actualizado */
        let productsList = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'))

        /* Rederiza la lista de productos pasandole el JSON completo*/
        res.render('./products/productList', {productos: productsList})
    },
    
    /* Detalle de producto */
    detail: function(req, res) {

        /* Lee y guarda el JSON en esta variable cada vez que se abre el detalle de producto,
        para tener todo actualizado */
        let productsDet = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'))
        
        /* Del parametro id en la ruta se obtiene el id del producto deseado */
        let idProductoSeleccionado = req.params.id
        
        /* El producto detail es null hasta encontrarlo en el JSON */
        let productoDetail = null

        /* Se busca el producto en el JSON */
        for (let p of productsDet){
            if (p.id == idProductoSeleccionado) {
                /* Se encontró, ahora ya no es null, es todos los datos de ese producto en el JSON */
                productoDetail = p
                break
            }
        }

        /* Se renderiza el detalle pasandole el producto deseado y todos los productos para las tarjetas de "TE PUEDE INTERESAR" */
        res.render('./products/productDetail', {productos: productsDet, producto: productoDetail})
    },

    /* Mostrar formulario crear producto */
    create: function(req, res) {

        /* Lee y guarda el JSON en esta variable cada vez que se abre crear producto,
        para tener todo actualizado */
        let productsCre = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'))

        /* Por ahora el producto no existe */
        let existProduct = false
        
        /* se inicializa como nada (undefined) */
        let idNuevo
        
        /* Miramos si hay al menos un producto en el JSON */
        if (productsCre[productsCre.length-1] === undefined) {
            idNuevo = 1 /* No hay, empezamos en 1 */
        } else {
            /* Si hay, pasamos el id del producto que sera creado */
            idNuevo = productsCre[productsCre.length-1].id + 1
        }

         /* Se renderiza crear producto pasandole la id del producto que sera creado*/
        res.render('./products/createProduct', {idNuevo: idNuevo, existe: existProduct})
    },

    /* Guardar producto desde crear */
    store: function(req, res) {

        /* Lee y guarda el JSON en esta variable cada vez que se guarda un producto,
        para tener todo actualizado */
        let productsStor = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'))
        
        /* Aqui guardaremos los archivos que no sean aceptados */
        let notSave = []

        /* se inicializa como nada (undefined) */
        let idNuevo
        
        /* Miramos si hay al menos un producto en el JSON */
        if (productsStor[productsStor.length-1] === undefined) {
            idNuevo = 1 /* No hay, empezamos en 1 */
        } else {
            /* Si hay, pasamos el id del producto que sera creado */
            idNuevo = productsStor[productsStor.length-1].id + 1
        }

        /* Por ahora el producto no existe */
        let existProduct = false

        /* Buscamos en el JSON para ver si existe el producto */
        for (let p of productsStor){
            if (p.id == req.body.id) {
                /* Se encontró, No debemos guardarlo de nuevo */
                existProduct = true
                /* Se renderiza el formulario para mostrar un mensaje de que ya existe */
                /* El return es super importante para no ejecutar nada despues de renderizar el formulario */
                return res.render('./products/createProduct', {idNuevo: idNuevo, existe: existProduct})
            }
        }

        /* Del formulario (body) creamos un nuevo producto (objeto)*/
        let productoCreado = {
            id: parseInt(req.body.id), /* parseInt transforma de texto a numero */
            name: req.body.name,
            price: parseInt(req.body.price.replace(/\D+/g, "")), /* Elimina todo lo que no sean digitos */
            discount: '',
            category: req.body.category,
            delivery: parseInt(req.body.delivery),
            description: req.body.description,
            image: [] /* Aqui guardaremos las imagenes del producto */
        }
        let discount = req.body.discount.replace(/\D+/g, "")
        
        /* Si hay descuento se convierte a numero y se guarda */
        if (!isNaN(discount) && !isNaN(parseFloat(discount))) {
            discount = (productoCreado.price*parseInt(discount))/100;
            productoCreado.discount = productoCreado.price - discount                    
        }

        /* Aqui pondremos la imagens para recorrelas mas adelante */
        let fotos = []

        /* Si solo hay una imagen la agregamos a fotos */
        if (!Array.isArray(req.files.foto)) {
            fotos.push(req.files.foto)
        } else {
            /* Si hay varias imagenes, estas seran la varible fotos (es diferente a hacer push) */
            fotos = req.files.foto
        }
        
        /* Recorremos las fotos para guardarlas una a una */
        for (let image of fotos) {
            let name = image.name
            let uniqName = 'Prod' + Date.now() + name /* Nombre unico de la foto con fecha actual */
            let extName = image.mimetype /* Tipo de archivo (.jpg .png .pdf .doc etc) */
            
            /* Si la foto (image) es del tipo que queremos y pesa menos de 500 kb, se guarda*/
            if (imgList.includes(extName) && image.size <= 512000) {
                
                productoCreado.image.push(uniqName) /* Guardamos en el nuevo producto (mirar linea 121) */
                
                /* Guardamos en la carpeta public/img/productos (mirar linea 8)*/
                image.mv(storepath + uniqName, (err) => {
                    if (err) {res.send(err)}
                })
            } else {
                /* Si no es aceptado se agrega a este array (mirar linea 85) */
                notSave.push(name)
            }
        }
        
        /* Se agrega el produco a la variable que contiene el JSON (mirar linea 82) */
        productsStor.push(productoCreado);

        /* Se sobre-escribe el JSON con el nuevo producto */
        fs.writeFileSync(productsFilePath, JSON.stringify(productsStor,null,' '))

        if (notSave.length > 0) {
            /* Si hay archivos no guardados se pasan a editar producto para ser mostrados */
            res.render('./products/editProduct', {producto: productoCreado, noguardado: notSave})
        } else {
            /* Si todo salio bien se muestra el detalle del producto creado */
            res.redirect(`/products/detail/${productoCreado.id}`)
        }

        /* sharp opcional para comprimir imagenes*/
    },

    /* Mostrar formulario editar producto */
    edit: function(req, res) {

        /* Lee y guarda el JSON en esta variable cada vez que se abre editar producto,
        para tener todo actualizado */
        let productsEdit = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'))
        
        /* Aqui guardaremos los archivos que no sean aceptados (en este caso siempre vacio, pero es necesario que exista)*/
        let notSave = []

        /* Obtenemos el id del producto a editar de la barra de busqueda (query) */
        let idProductoSeleccionado = req.query.id
        
        /* Creamos un producto que estara vacio por ahora */
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
        
        /* Buscamos el producto en el JSON */
        for (let item of productsEdit){
            /* Si lo encontramos, actualizamos el producto de la linea 194 con esos valores */
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
        
        /* Se renderiza editar producto pasandole el producto (vacio o con valores, esto depende de si lo encontramos o no)
        tambien pasamos la busqueda que se hizo y el array vacio de no guardados (necesario)*/
        res.render('./products/editProduct', {producto: productoEditado, busqueda: idProductoSeleccionado, noguardado: notSave})
    },

    /* Actualizar producto desde editar */
    update: function(req, res) {

        /* Del formulario (body) obtenemos los datos (objeto)*/
        const productoEditado = req.body
        
        /* La id del producto */
        const idBuscado = req.body.id

        /* Lee y guarda el JSON en esta variable cada vez que se edita un producto,
        para tener todo actualizado */
        let productsUpd = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'))
        
        /* Aqui guardaremos los archivos que no sean aceptados */
        let notSave = []

        /* Aqui pondremos la imagens para recorrelas mas adelante */
        let fotos = []
        
         /* Buscamos el producto en el JSON */
        for(let item of productsUpd) {
             /* Si lo encontramos, actualizamos el producto con los datos de la linea 233 */
            if (item.id == idBuscado) {

                /* Parte de esto ya se explicó desde la linea 113 hasta la 161 (cambia el orden un poquito)*/
                item.id = parseInt(productoEditado.id)
                item.name = productoEditado.name
                item.price = parseInt(productoEditado.price.replace(/\D+/g, ""))
                
                let discount = productoEditado.discount.replace(/\D+/g, "")
                
                if (!isNaN(discount) && !isNaN(parseFloat(discount))) {
                    discount = (item.price*parseInt(discount))/100;
                    item.discount = item.price - discount                  
                } else {
                    item.discount = ''
                }                 
                
                item.category = productoEditado.category
                item.delivery = parseInt(productoEditado.delivery)
                item.description = productoEditado.description
                item.image = item.image
                
                /*borrar imagenes*/
                let eliminar=[]
                for( let index = 0; index < item.image.length; index++ ) {
                    let borrar='borrar'+index
            
                    if (productoEditado[borrar]!==undefined){
                        eliminar.push(productoEditado[borrar])
                    }
                }   
            
                let updateImages = item.image.filter(imagen => !eliminar.includes(imagen))
                
                item.image=updateImages
                /* Se elimina cada imagen del producto */
                for (let eliminada of eliminar) {
                    fs.unlinkSync(storepath + eliminada)
                }
                    
                if (req.files !== null && !Array.isArray(req.files.foto)) {
                    fotos.push(req.files.foto)
                } else if (req.files !== null && Array.isArray(req.files.foto)) {
                    fotos = req.files.foto
                }
                
                /* Si se subio una imagen (porque en editar no es obligatoria) */
                if (req.files !== null) {
                    for (let image of fotos) {
                        let name = image.name
                        let uniqName = 'Prod' + Date.now() + name
                        let extName = image.mimetype
                        if (imgList.includes(extName) && image.size <= 512000) {
                            item.image.push(uniqName)
                            image.mv(storepath + uniqName, (err) => {
                                if (err) {res.send(err)}
                            })
                        } else {
                            notSave.push(name)
                        }
                    }
                }
                
            break

            }                
        }

        /* Se sobre-escribe el JSON con el producto editado*/
        fs.writeFileSync(productsFilePath, JSON.stringify(productsUpd,null,' '))       
        
        if (notSave.length > 0) {
            /* Si hay archivos no guardados se pasan a editar producto para ser mostrados */
            res.render('./products/editProduct', {producto: productoEditado, noguardado: notSave})
        } else {
            /* Si todo salio bien se muestra el detalle del producto editado */
            res.redirect(`/products/detail/${idBuscado}`)
        }

        /* sharp opcional para comprimir imagenes*/
    },

    /* Eliminar producto desde editar */
    destroy: function(req, res) {

        
        /* Lee y guarda el JSON en esta variable cada vez que se elimina un producto,
        para tener todo actualizado */
        let productosDes = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'))

        /* Del parametro id en la ruta se obtiene el id del producto a eliminar */
        let eliminar = req.params.id
        
        /* El producto eliminado es null hasta encontrarlo en el JSON */
        let productoEliminado = null

        /* Se busca el producto en el JSON */
        for (let item of productosDes) {
            if (item.id == eliminar) {
                /* Se encontró, ahora ya no es null, es todos los datos de ese producto en el JSON */
                productoEliminado = item  
                break
            }
        }

        /* Con filter se obtiene una nueva variable con todos los productos menos el eliminado */
        let produtosNew = productosDes.filter(function(item) {
            return item.id != productoEliminado.id
        })

        /* Se elimina cada imagen del producto */
        for (let image of productoEliminado.image) {
            fs.unlinkSync(storepath + image)
        }

        /* Se sobre-escribe el JSON sin el producto eliminado */
        fs.writeFileSync(productsFilePath, JSON.stringify(produtosNew, null,' '))

        /* Si todo salio bien se muestra la lista de productos */
        res.redirect('/products/') 
    }
}

module.exports = productsController
