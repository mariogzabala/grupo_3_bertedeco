function bertedecoData (sequelize, dataTypes) {

    let alias = "AdminUserTypes";
    
    let cols = {
        id: {type: dataTypes.INTEGER, primaryKey: true, autoincrement: true},
        admin_type: {type: dataTypes.STRING(45), allowNull: false},
        persmissions: {type: dataTypes.STRING(45), allowNull: false},
    }
        
    let config = {tableName: "admin_user_type", camelCase: false, underscored: true, timestamps: false};
    
    const AdminUserType = sequelize.define(alias, cols, config);

    AdminUserType.associate = function(models){

        AdminUserType.hasMany(models.AdminUsers,{
        as: "admins",
        foreingKey: "admin_user_type_id"   
        })        
    }         
    return AdminUserType;
}
module.exports = bertedecoData