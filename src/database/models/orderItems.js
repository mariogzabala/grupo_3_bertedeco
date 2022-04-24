function bertedecoData(sequelize, DataTypes) {
    
    alias = "OrderItems"
    
    cols = {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        sku: {type: DataTypes.STRING(45), allowNull: false},
        price: {type: DataTypes.FLOAT, allowNull: false},
        discount: {type: DataTypes.DECIMAL, allowNull: false},
        quantity:{type: DataTypes.INTEGER, allowNull:false},
        shipping: {type: DataTypes.FLOAT, allowNull: false},
        total: {type: DataTypes.FLOAT, allowNull: false},
        active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
    }

    config = {tableName: "order_item", camelCase: false, underscored: true, timestamps: false}

    const OrderItems = sequelize.define(alias, cols, config)

    OrderItems.associate = function(models) {

        /*  una orden_item tiene un prod */
        OrderItems.belongsTo(models.Products, {
            as: "product",
            foreignKey: "product_id" 
        })

        /* una Orden_item tiene una order*/
        OrderItems.belongsTo(models.Products, {
            as: "order",
            foreignKey: "order_id" 
        })

    }

    return OrderItems
}

module.exports = bertedecoData
