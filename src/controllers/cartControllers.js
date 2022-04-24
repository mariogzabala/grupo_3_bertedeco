const fs = require('fs')
const path = require('path')
const db = require('../database/models')
const { Op } = require("sequelize")

let cartController = {
    resume: function(req, res) {
        /* db.Orders.findAll({
            include:[{association: 'orderItems'}],
        }).then (function(orders) {
            return res.send (orders) 
        })  */
        res.render('./cart/productCart')  

    }          
        
}

module.exports = cartController
