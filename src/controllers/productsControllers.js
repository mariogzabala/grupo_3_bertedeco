const fs = require('fs')
const path = require('path')

const productsFilePath = path.join(__dirname, '../database/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const storepath = path.join(__dirname, '../../public/img/productos/');
let productsController = {

    /* Lista de productos */
    list: function(req, res) {
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
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

    /* Guardar producto desde crear Francys*/
    store: function(req, res) {
        /* Guardar el producto y sus imagenes, redireccionar al detalle
        de producto creado*/

        let idProductoNuevo = req.body.prodId - 16
        /* console.log(idProductoSeleccionado); */
        let productoCreado = null

        for (let p of products){
            if (p.id == idProductoNuevo){
                productoCreado = p
                break
            }
        }

        /* console.log(req.files); */
        const objImagen = req.files.foto
        const name = objImagen.name
        objImagen.mv(__dirname + '../../../public/img/productos/' + name, (err) => {
        if (err) {res.send(err)}
        res.render('./products/productDetail', {productos: products, producto: productoCreado})
        })

        /* sharp opcional */
    },

    /* Mostrar formulario editar producto Mario*/
    edit: function(req, res) {
         let idProductoSeleccionado = req.query.id
         let productoEditado = {
            id:"",
            name:"",
            price:"",
            discount:"",
            category:"",
            delivery:"",
            description:"",
            image:[]
            
        }
        
        for (let item of products){
            if (item.id == idProductoSeleccionado){
                productoEditado.id=item.id;
                productoEditado.name=item.name;
                productoEditado.price=item.price;
                productoEditado.discount=item.discount;
                productoEditado.category=item.category;
                productoEditado.delivery= item.delivery
                productoEditado.description=item.description;
                productoEditado.image=item.image                
                break
            }
        }

       /*

        /* Con la id que llega por query encontrar el producto en la base de datos (JSON)
        Autocompletar el formulario con los datos del JSON execpto las imagenes y pasarle el id al delete
        
        Si no se encontro el producto renderizar el formulario con el mensaje de que no es encontro */
        res.render('./products/editProduct', {producto: productoEditado, busqueda: idProductoSeleccionado});
    },

    /* Actualizar producto desde editar Mario*/
    update: function(req, res) {
        /* Actualizar el JSON con los nuevos valores y las imagenes de ser necesario
         y redireccionar al detalle de producto editado*/
         const productoEditado = req.body
         const idBuscado = req.params.id
         let productosNuevos = products
         for(let item of productosNuevos){
             if (item.id == idBuscado){
                 item.id = parseInt(productoEditado.id);
                 item.name = productoEditado.name;
                 item.price = parseInt(productoEditado.price);
                 if (!isNaN(productoEditado.discount) && !isNaN(parseFloat(productoEditado.discount))){
                     item.discount = parseInt(productoEditado.discount);                    
                 } else {
                    item.discount = '';
                 }                 
                 item.category = productoEditado.category;
                 item.delivery = parseInt(productoEditado.delivery);
                 item.description = productoEditado.description;
                 /*item.image = productoEditado.image;*/
                 break
             }                
         }
       
         fs.writeFileSync(productsFilePath, JSON.stringify(productosNuevos,null,' '));        
         res.render('error')
    },

    /* Eliminar producto desde editar Julian*/
    destroy: function(req, res) {
        /* Eliminar el producto y sus imagenes y redireccionar a la lista de productos */
        let eliminar = req.params.id;
        let encontrado = null;

        for (let item of products){
			if (item.id==eliminar){
				encontrado=item;
				break;
			}
		}

		let produtosNew = products.filter(function(item){
			return item.id!=encontrado.id;
		})

        for(let image of encontrado.image){

            console.log(storepath + image)
            fs.unlinkSync(storepath + image);
        }

		fs.writeFileSync(productsFilePath, JSON.stringify(produtosNew, null,' ')); 

        res.redirect('/products/') 
    }
}

module.exports = productsController
