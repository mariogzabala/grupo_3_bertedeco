function bertedecoData (sequelize, DataTypes) {

    let alias = "Carts"
    
    let cols = {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoincrement: true},
        subtotal: {type: DataTypes.FLOAT},
        total_discount: {type: DataTypes.FLOAT},
        shipping: {type: DataTypes.FLOAT},
        total: {type: DataTypes.FLOAT, allowNull: false},
        active: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
        created_at: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW},
        expires_at: {type: DataTypes.DATE, allowNull: false},       
    }
        
    let config = {tableName: "cart", camelCase: false, underscored: true, timestamps: false}
    
    const Cart = sequelize.define(alias, cols, config)

    Cart.associate = function(models){

        Cart.belongsTo(models.Users, {
            as: "user",
            foreingKey: "user_id"   
        })
        
        Cart.hasMany(models.CartItems, {
            as: "cart_items",
            foreingKey: "cart_id"   
        })       
        
    }
        
    return Cart
        
}
module.exports = bertedecoData
