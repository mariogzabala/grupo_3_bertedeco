function bertedecoData(sequelize, DataTypes) {
    
    alias = "Discounts"
    
    cols = {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING(45), allowNull: false},
        desc: {type: DataTypes.TEXT, allowNull: false},
        percent: {type: DataTypes.DECIMAL, allowNull: false},
        active: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
        created_at: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW},
        updated_at: {type: DataTypes.DATE},
    }

    config = {tableName: "discount", camelCase: false, timestamps: false}

    const Discount = sequelize.define(alias, cols, config)

    Discount.associate = function(models) {

        /* Un descuento tiene muchos productos */
        Discount.hasMany(models.Products, {
            as: "product",
            foreignKey: "discount_id" /* Nombre de la foreignKey que ira en la tabla product */
        })

    }

    return Discount
}

module.exports = bertedecoData
