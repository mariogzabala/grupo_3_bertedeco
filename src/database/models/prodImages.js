function bertedecoData(sequelize, DataTypes) {
    
    alias = "ProdImages"
    
    cols = {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING(100), allowNull: false},
    }

    config = {tableName: "prod_image", camelCase: false, timestamps: false}

    const ProdImage = sequelize.define(alias, cols, config)

    ProdImage.associate = function(models) {

        /* Una imagen tiene un producto */
        ProdImage.belongsTo(models.Products, {
            as: "product",
            foreignKey: "product_id" /* Nombre de la foreignKey que ira en la tabla prod_image (esta) */
        })

    }

    return ProdImage
}

module.exports = bertedecoData
