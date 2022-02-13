const express = require('express')
const path = require('path')

let indexRouter = require('./routes/index.js')
let productsRouter = require('./routes/products.js')
let usersRouter = require('./routes/users.js')
let cartRouter = require('./routes/cart.js')
let errorRouter = require('./routes/error.js')

const app = express()

//view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//npm start
app.listen(process.env.PORT || 3030, () => console.log('Servidor corriendo'))

app.use(express.static(path.join(__dirname, '../public')))

//pagina home
//usar localhost:3030/
app.use('/', indexRouter)

//pagina detalle producto
//usar localhost:3030/products
app.use('/products', productsRouter)

//pagina carrito
//usar localhost:3030/cart
app.use('/cart', cartRouter)

//pagina registro usuario
//usar localhost:3030/users
app.use('/users', usersRouter)

// Maneja los errores 404 - Mantener esto al final del archivo
app.use('*', errorRouter)