const express = require('express')
const path = require('path')

const app = express()

//npm run serve
app.listen(process.env.PORT || 3030, () => console.log('Servidor corriendo'))

//pagina home
//usar localhost:3030/
app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname, './views/index.html'))
})

//pagina detalle producto
//usar localhost:3030/product
app.get('/product', function(req, res) {
    res.sendFile(path.resolve(__dirname, './views/productDetail.html'))
})

//pagina carrito
//usar localhost:3030/cart
app.get('/cart', function(req, res) {
    res.sendFile(path.resolve(__dirname, './views/productCart.html'))
})

//pagina registro usuario
//usar localhost:3030/register
app.get('/register', function(req, res) {
    res.sendFile(path.resolve(__dirname, './views/register.html'))
})

//pagina login
//usar localhost:3030/login
app.get('/login', function(req, res) {
    res.sendFile(path.resolve(__dirname, './views/login.html'))
})

app.use(express.static(path.join(__dirname, './public')))
app.use(express.static(path.join(__dirname, './views')))