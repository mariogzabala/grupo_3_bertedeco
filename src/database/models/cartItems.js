function bertedecoData (sequelize, dataTypes) {

    let alias = "CartItems";
    
    let cols = {
        id: {type: dataTypes.INTEGER, primaryKey: true, autoincrement: true},
        sku: {type: dataTypes.STRING(45), allowNull: false},
        price: {type: dataTypes.FLOAT, allowNull: false},
        discount: {type: dataTypes.DECIMAL, allowNull: false},
        quantity: {type: dataTypes.INTEGER, allowNull: false},
        shipping: {type: dataTypes.FLOAT, allowNull: false},
        total: {type: dataTypes.FLOAT, allowNull: false},
        active: {type: dataTypes.BOOLEAN, allowNull: false, defaultValue: true},
        cart_id: {type: dataTypes.INTEGER},
        product_id: {type: dataTypes.INTEGER}      
        }
        
        let config = {tableName: "cart_item", camelCase: false, underscored: true, timestamps: false};
    
        const CartItem = sequelize.define(alias, cols, config);

        CartItem.associate = function(models){

            CartItem.belongsTo(models.Carts,{
                as: "cart",
                foreingKey: "cart_id"
            });
            
            CartItem.belongsTo(models.Products,{
                as: "product",
                foreingKey: "product_id"
            });    
        }
        return CartItem;        
}
module.exports = bertedecoData