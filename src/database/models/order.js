function bertedecoData(sequelize, DataTypes) {
    
    alias = "Orders"
    
    cols = {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        subtotal: {type: DataTypes.FLOAT, allowNull: false},
        shipping: {type: DataTypes.FLOAT, allowNull: false},
        tax: {type: DataTypes.FLOAT, allowNull: false},
        promo_code: {type: DataTypes.STRING(45), allowNull: false},
        discount:{type: DataTypes.FLOAT, allowNull: false},
        total:{type: DataTypes.FLOAT, allowNull: false},
        name: {type: DataTypes.STRING(45), allowNull: false},
        email: {type: DataTypes.STRING(50), allowNull: false},
        phone: {type: DataTypes.STRING(20), allowNull: false},
        country: {type: DataTypes.STRING(30), allowNull: false},
        estate:{type: DataTypes.STRING(30), allowNull: false},
        city: {type: DataTypes.STRING(45), allowNull: false},
        address: {type: DataTypes.STRING(100), allowNull: false},
        zip: {type: DataTypes.STRING(12), allowNull: false},
        shipped: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.NOW},
        delivery_date: { type: DataTypes.DATE, allowNull:false},
    }

    config = {tableName: "order", camelCase: false, underscored: true, timestamps: false}

    const Order = sequelize.define(alias, cols, config)

    Order.associate = function(models) {

        /* Un producto tiene muchas imagenes */
        Order.hasMany(models.OrderItems, {
            as: "orderItems",
            foreignKey: "order_id" /* Nombre de la foreignKey que ira en la tabla prod_image */
        })

    }

    return Order
}

module.exports = bertedecoData