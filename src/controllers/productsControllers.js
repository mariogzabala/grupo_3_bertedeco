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
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
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

        let productoCreado = {
            id: parseInt(req.body.id),
            name:req.body.name,
            price: parseInt(req.body.price),
            discount:'',
            category:req.body.category,
            delivery: parseInt(req.body.delivery),
            description:req.body.description,
            image:[]
        };

        if (!isNaN(req.body.discount) && !isNaN(parseFloat(req.body.discount))){
            productoCreado.discount = parseInt(req.body.discount);                    
        }

        for (let image of req.files.foto) {
            let name = image.name;
            productoCreado.image.push(name);
            image.mv(storepath + name, (err) => {
                if (err) {res.send(err)}
            })
        }
        
        products.push(productoCreado);
	
		fs.writeFileSync(productsFilePath, JSON.stringify(products,null,' '));

		res.redirect(`/products/detail/${productoCreado.id}`)

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
                 item.image = item.image;
                  if (req.files!== null){
                    for (let image of req.files.foto) {
                        let name = image.name;
                        item.image.push(name);
                        image.mv(storepath + name, (err) => {
                            if (err) {res.send(err)}
                        })
                    }
                 } 
                 break
             }                
         }
       
         fs.writeFileSync(productsFilePath, JSON.stringify(productosNuevos,null,' '));        
         res.redirect(`/products/detail/${idBuscado}`)
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
