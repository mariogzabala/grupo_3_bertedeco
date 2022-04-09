function bertedecoData(sequelize, DataTypes) {
    
    alias = "UserPayments"
    
    cols = {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        number: {type: DataTypes.STRING(45), allowNull: false},
        cvv: {type: DataTypes.STRING(45), allowNull: false},
        expiry_year: {type: DataTypes.STRING(45), allowNull: false},
        expiry_month: {type: DataTypes.STRING(45), allowNull: false},
        owner: {type: DataTypes.STRING(45), allowNull: false},
        type: {type: DataTypes.STRING(45), allowNull: false, defaultValue: 'credit'},
    }

    config = {tableName: "user_payment", camelCase: false, timestamps: false}

    const UserPayment = sequelize.define(alias, cols, config)

    UserPayment.associate = function(models) {

        /* Un metodo de pago le pertenece a un usuario */
        UserPayment.belongsTo(models.Users, {
            as: "user",
            foreignKey: "user_id" /* Nombre de la foreignKey que ira en esta tabla */
        })

    }

    return UserPayment
}

module.exports = bertedecoData
