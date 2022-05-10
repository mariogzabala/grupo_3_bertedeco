const db = require('../database/models')

let cartController = {
    
    /* Carro (resumen de compra) */
    resume: async function(req, res) {

        try {
             /* Traer el carrito para obtener los valores antiguos */
            let cart = await db.Carts.findOne({
                where: {user_id: req.params.user_id},
            })

            /* Renderizar a pagina de carro vacio */
            if(!cart) {
                return res.render('./cart/emptyCart')
            }

            /* Verificar si se debe destruir por fecha vencida */
            let wasDestroyed = await cartController.destroyDueToDate(cart)

            /* Renderizar a pagina de carro vacio */
            if(wasDestroyed) {
                return res.render('./cart/emptyCart')
            }
            
            /* Actualizamos el carro antes de renderizar */
            cart = await cartController.updateCart(cart.dataValues.id, req.params.user_id)

            return res.render('./cart/productCart', {cart})
        
        } catch (err) {
            return res.render('error')
        }
       

    },

    /* Crear carrito */
    createCar: async function(user_id, prod_id) {

        try {
            /* Trae el producto deseado buscandolo por id */
            let product = await db.Products.findByPk(prod_id, {
                include: [{association: 'discount'}]
            })

            let price = product.dataValues.price
            let percent = product.discount.dataValues.percent
            let priceWithDiscount = Math.round(price - (price * (percent / 100)))
            let discount = price - priceWithDiscount
            let shipping = priceWithDiscount > 5000 ? 0 : Math.round(priceWithDiscount / 25)
            let total = priceWithDiscount + shipping
            let expirationDate = new Date(Date.now() + ( 3600 * 1000 * 24))

            let newCart = {
                subtotal: price,
                total_discount: discount,
                shipping: shipping,
                total: total,
                expires_at: expirationDate,
                user_id: user_id,
            }

            let cart = await db.Carts.create(newCart)

            /* cart.null es la id del cart */
            return cart.null
        
        } catch (err) {
            return res.render('error')
        }

    },

    /* Actualizar carro agregando nuevo producto */
    updateCart: async function(cart_id, user_id) {

        try {
            /* Traer el carro con sus items y estos items con su producto y este producto con sus imagenes y descuento NESTED `) */
            let cart = await db.Carts.findByPk(cart_id, {
                include: [{association: 'cart_items', include: [{association: 'product', include: [{association: 'images'}, {association: 'discount'}]}]}],
                order: [['cart_items', 'id', 'ASC']]
            })

            let subtotal = 0
            let total_discount = 0
            let total = 0

            for (let item of cart.cart_items) {
                let quantity = item.quantity
                let price = item.product.price * quantity
                let percent = item.product.discount.percent
                let priceWithDiscount = Math.round(price - (price * (percent / 100))) * quantity
                subtotal += price
                total_discount += (price - priceWithDiscount)
                total += priceWithDiscount
            }

            let shipping = total > 5000 ? 0 : Math.round(total / 25)
            total += shipping

            let updatedCart = {
                subtotal: subtotal,
                total_discount: total_discount,
                shipping: shipping,
                total: total,
            }

            let newCart = await db.Carts.update(updatedCart, {where: {id: cart_id}})

            cart = await db.Carts.findByPk(cart_id, {
                include: [{association: 'cart_items', include: [{association: 'product', include: [{association: 'images'}, {association: 'discount'}]}]}],
                order: [['cart_items', 'id', 'ASC']]
            })

            return cart
        
        } catch (err) {
            return res.render('error')
        }
        

    },

    /* Destruir los cart items y el cart en caso de que haya expirado */
    destroyDueToDate: async function(cart) {

        try {
            let currentDate = new Date().toISOString()
            let expirationDate = cart.dataValues.expires_at.toISOString()
            let cartId = cart.dataValues.id

            if (expirationDate < currentDate) {
                
                /* Destruir carro vencido y sus items */
                let destroyItems = await db.CartItems.destroy({where: {cart_id: cartId}})
                let destroyCart = await db.Carts.destroy({where: {id: cartId}})

                return true

            }

            return false
        
        } catch (err) {
            return res.render('error')
        }

    },

    /* Crear item */
    addItem: async function(cart_id, prod_id) {

        let newItem = {
            cartId: cart_id, /* Se usa camelCase porque sequelize es basura :) */
            product_id: prod_id,
        }

        try {
            let item = await db.CartItems.create(newItem)

            /* retornamos el id para indicar el exito del proceso */
            return item.null

        } catch (err) {
            return res.render('error')
        }

    },

    /* Actualizar item cuando se suma o resta 
    updateItem: async function(req, res) {

    }, */

    /* Eliminar item */
    deleteItem: async function(req, res) {

        try {
            let deleted = await db.CartItems.destroy({where: {id: req.params.item_id}})
        
            /* Redireccionar a resume con el user_id */
            return res.redirect(`/cart/resume/${req.params.user_id}`)

        } catch (err) {
            return res.render('error')
        }

    },

    main: async function(req, res) {
        
        try {
            /* Se redirecciona a home en caso de que los params no permintan crerar un carro */
            if (req.params.user_id == 0 || !req.params.prod_id) {
                return res.redirect('/home')
            }

            /* Encontrar el usuario y sus carritos */
            let user = await db.Users.findByPk(req.params.user_id, {include: [{association: 'carts'}], order: [['carts', 'id', 'ASC']]})

            /* Se redirecciona a home en caso de encontrar un usuario */
            if (!user) {
                return res.redirect('/home')
            }

            let cart = user.carts[user.carts.length - 1]
            let cartId = null
            let wasDestroyed = false
            
            /* Si hay un carro */
            if (cart) {

                /* Verificar si se debe destruir por fecha vencida */
                wasDestroyed = await cartController.destroyDueToDate(cart)
                
                /* Este valor podria cambiar si el carro fue destruido */
                cartId = cart.dataValues.id

            } else if (!cart || wasDestroyed) {

                /* Crear un carro ya que no hay */
                cartId = await cartController.createCar(user.dataValues.id, req.params.prod_id)
            }
            
            /* Traer carro y sus items */
            let cartItems = await db.Carts.findByPk(cartId, {include: [{association: 'cart_items'}], order: [['cart_items', 'id', 'ASC']]})

            addNewItem = true

            /* Solo se crea un item si no existe en el carro */
            for (let item of cartItems.cart_items) {
                if (item.dataValues.product_id == req.params.prod_id) {
                    addNewItem = false
                    break
                }
            }

            if(addNewItem) {

                /* Agregar el producto */
                let added = await cartController.addItem(cartId, req.params.prod_id)

            }

            /* Redireccionar a resume con el user_id */
            return res.redirect(`/cart/resume/${user.dataValues.id}`)

        } catch (err) {
            return res.render('error')
        }

    }

}

module.exports = cartController
