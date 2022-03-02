const fs = require('fs')
const path = require('path')

const productsFilePath = path.join(__dirname, '../database/productsDataBase.json')

let indexController = {
    home: function(req, res) {
        let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'))
        res.render('index', {productos: products})
    }

}

module.exports = indexController
