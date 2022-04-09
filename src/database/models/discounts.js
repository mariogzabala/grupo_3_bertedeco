function bertedecoData(sequelize, DataTypes) {
    
    alias = "Discounts"
    
    cols = {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING(45), allowNull: false},
        desc: {type: DataTypes.TEXT, allowNull: false},
        percent: {type: DataTypes.DECIMAL, allowNull: false},
        active: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
        createdAt: { type: DataTypes.DATE, field: 'created_at' },
        updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    }

    config = {tableName: "discount", camelCase: false, underscored: true, timestamps: true}

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
