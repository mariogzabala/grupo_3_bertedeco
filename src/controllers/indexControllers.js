const fs = require('fs')
const path = require('path')

const productsFilePath = path.join(__dirname, '../database/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

let indexController = {
    home: function(req, res) {
        res.render('index', {productos: products})
    }

}

module.exports = indexController
