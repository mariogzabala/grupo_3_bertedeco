const createError = require('http-errors')
const express = require('express')
const path = require('path')
const methodOverride =  require('method-override'); // Para poder usar los métodos PUT y DELETE
const expressFileUpload = require('express-fileupload')

const app = express()

/* Middlewares */
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method')); // Para poder pisar el method="POST" en el formulario por PUT y DELETE
app.use(expressFileUpload({
  limits: { fileSize: 512000 }, // 500kb
  abortOnLimit: true,
  responseOnLimit: "El peso del archivo que intentas subir supera el limite permitido",
})
)

//view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Route System require and use()
const indexRouter = require('./routes/index.js')
const productsRouter = require('./routes/products.js')
const usersRouter = require('./routes/users.js')
const cartRouter = require('./routes/cart.js')

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

// ************ NO TOCAR ************
// ************ catch 404 and forward to error handler ************
app.use((req, res, next) => next(createError(404)))

// ************ error handler ************
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.path = req.path
  res.locals.error = req.app.get('env') === 'development' ? err : {} 

  // render the error page
  res.status(err.status || 500)
  res.render('error')
});
