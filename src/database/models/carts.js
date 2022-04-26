function bertedecoData (sequelize, dataTypes) {

    let alias = "Carts";
    
    let cols = {
        id: {type: dataTypes.INTEGER, primaryKey: true, autoincrement: true},
        subtotal: {type: dataTypes.STRING(45), allowNull: false},
        total_discount: {type: dataTypes.FLOAT},
        total: {type: dataTypes.FLOAT, allowNull: false},
        session_id: {type: dataTypes.STRING(100), allowNull: false},
        active: {type: dataTypes.BOOLEAN, allowNull: false, defaultValue: true},
        created_at: {type: dataTypes.DATE, allowNull: false, defaultValue: dataTypes.NOW},
        expires_at: {type: dataTypes.DATE, allowNull: false}, 
        /*user_id: {type: dataTypes.INTEGER}*/       
    }
        
    let config = {tableName: "cart", camelCase: false, underscored: true, timestamps: false};
    
    const Cart = sequelize.define(alias, cols, config);

    Cart.associate = function(models){

        Cart.belongsTo(models.Users,{
        as: "user",
        foreingKey: "user_id"   
        });
        
        Cart.hasMany(models.CartItems,{
        as: "cartItems",
        foreingKey: "cart_id"   
        });        
        
    }    
    return Cart;
        
}
module.exports = bertedecoData