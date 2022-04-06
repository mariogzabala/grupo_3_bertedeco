function bertedecoData(sequelize, DataTypes) {
    
    alias = "Products"
    
    cols = {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        sku: {type: DataTypes.STRING(45), allowNull: false},
        name: {type: DataTypes.STRING(100), allowNull: false},
        price: {type: DataTypes.FLOAT, allowNull: false},
        category: {type: DataTypes.STRING(45), allowNull: false},
        short_desc: {type: DataTypes.STRING(100), allowNull: false},
        long_desc: {type: DataTypes.TEXT},
        stock: {type: DataTypes.INTEGER, allowNull: false},
        delivery: {type: DataTypes.INTEGER, allowNull: false},
        active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
        created_at: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW},
        updated_at: {type: DataTypes.DATE},
    }

    config = {tableName: "product", camelCase: false, timestamps: false}

    const Product = sequelize.define(alias, cols, config)

    Product.associate = function(models) {

        /* Un producto tiene muchas imagenes */
        Product.hasMany(models.ProdImages, {
            as: "images",
            foreignKey: "product_id" /* Nombre de la foreignKey que ira en la tabla prod_image */
        })

        /* Un producto tiene un descuento */
        Product.belongsTo(models.Discounts, {
            as: "discount",
            foreignKey: "discount_id" /* Nombre de la foreignKey que ira en la tabla product (esta) */
        })

    }

    return Product
}

module.exports = bertedecoData
