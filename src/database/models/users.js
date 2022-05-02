function bertedecoData(sequelize, DataTypes) {
    
    alias = "Users"
    
    cols = {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        email: {type: DataTypes.STRING(50), allowNull: false},
        password: {type: DataTypes.STRING(500), allowNull: false},
        first_name: {type: DataTypes.STRING(45), allowNull: false},
        last_name: {type: DataTypes.STRING(45), allowNull: false},
        phone: {type: DataTypes.STRING(20)},
        image: {type: DataTypes.STRING(100)},
        createdAt: { type: DataTypes.DATE, field: 'created_at' },
        updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    }

    config = {tableName: "user", camelCase: false, underscored: true, timestamps: true}

    const User = sequelize.define(alias, cols, config)

    User.associate = function(models) {

        /* Un usuario tiene muchas direcciones */
        User.hasMany(models.UserAddresses, {
            as: "address_list",
            foreignKey: "user_id" /* Nombre de la foreignKey que ira en la tabla user_address */
        })

        /* Un usuario tiene muchos metodos de pago */
        User.hasMany(models.UserPayments, {
            as: "payment_list",
            foreignKey: "user_id" /* Nombre de la foreignKey que ira en la tabla user_payment */
        })

        User.hasMany(models.Carts, {
            as: "carts",
            foreignKey: "user_id"
        })

    }

    return User
}

module.exports = bertedecoData
