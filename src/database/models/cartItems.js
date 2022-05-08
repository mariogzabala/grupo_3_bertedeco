function bertedecoData (sequelize, DataTypes) {

    let alias = "CartItems"
    
    let cols = {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoincrement: true},
        quantity: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
        active: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},      
        }
        
        let config = {tableName: "cart_item", camelCase: false, underscored: true, timestamps: false};
    
        const CartItem = sequelize.define(alias, cols, config)

        CartItem.associate = function(models) {

            CartItem.belongsTo(models.Carts, {
                as: "cart",
                foreingKey: "cart_id"
            })
            
            CartItem.belongsTo(models.Products, {
                as: "product",
                foreingKey: "product_id"
            })    
        }

        return CartItem;        
}
module.exports = bertedecoData
