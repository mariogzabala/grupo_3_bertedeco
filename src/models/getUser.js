const fs = require('fs')
const path = require('path')

/* Donde esta el JSON */
const usersFilePath = path.join(__dirname, '../database/usersDataBase.json')

let getUser = {
    
    /* Lee todo el json */
    getData: function() {
        return JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'))
    },

    findAll: function() {
        return this.getData()
    },

    /* Encuentra por id */
    findByPk: function(id) {
        let allUsers = this.findAll()
        let userFound= allUsers.find(oneUser => oneUser.id === id)
        return userFound
    },

    /* Encuentra por el campo y el valor que se le especifique */
    findByField: function(field, value) {
        let allUsers = this.findAll()
        let userFound= allUsers.find(oneUser => oneUser[field] === value)
        return userFound
    }
}

module.exports = getUser
