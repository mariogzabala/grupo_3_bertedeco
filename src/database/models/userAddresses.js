function bertedecoData(sequelize, DataTypes) {
    
    alias = "UserAddresses"
    
    cols = {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        place: {type: DataTypes.STRING(100), allowNull: false},
        country: {type: DataTypes.STRING(30), allowNull: false},
        estate: {type: DataTypes.STRING(30), allowNull: false},
        city: {type: DataTypes.STRING(45), allowNull: false},
        address: {type: DataTypes.STRING(100), allowNull: false},
        neighborhood: {type: DataTypes.STRING(100), allowNull: false},
        zipcode: {type: DataTypes.STRING(12), allowNull: false},
    }

    config = {tableName: "user_address", camelCase: false, timestamps: false}

    const UserAddress = sequelize.define(alias, cols, config)

    UserAddress.associate = function(models) {

        /* Una direccion le pertenece a un usuario */
        UserAddress.belongsTo(models.Users, {
            as: "user",
            foreignKey: "user_id" /* Nombre de la foreignKey que ira en esta tabla */
        })

    }

    return UserAddress
}

module.exports = bertedecoData
