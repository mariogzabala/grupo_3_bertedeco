const express = require('express')
const path = require('path')
const methodOverride =  require('method-override'); // Pasar poder usar los métodos PUT y DELETE

const app = express()

/* Middlewares */
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method')); // Pasar poder pisar el method="POST" en el formulario por PUT y DELETE

//view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Route System require and use()
const indexRouter = require('./routes/index.js')
const productsRouter = require('./routes/products.js')
const usersRouter = require('./routes/users.js')
const cartRouter = require('./routes/cart.js')
const errorRouter = require('./routes/error.js')

//npm start
app.listen(process.env.PORT || 3030, () => console.log('Servidor corriendo'))

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