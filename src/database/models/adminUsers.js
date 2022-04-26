function bertedecoData (sequelize, dataTypes) {
    
    let alias = "AdminUsers";
    
    let cols = {    
        id: {type: dataTypes.INTEGER, primaryKey: true, autoincrement: true},
        password: {type: dataTypes.STRING(500), allowNull: false},
        user_name: {type: dataTypes.STRING(45), allowNull: false},
        created_at: {type: dataTypes.DATE, allowNull: false, defaultValue: dataTypes.NOW},
        updated_at: {type: dataTypes.DATE},
        last_login: {type: dataTypes.DATE},
        
    }
    
    let config = {tableName: "admin_user", camelCase: false, underscored: true, timestamps: false}
    
    const AdminUser = sequelize.define(alias, cols, config);

    AdminUser.associate = function(models){

        AdminUser.belongsTo(models.AdminUserTypes,{
            as: "adminUserType",
            foreingKey: "admin_user_type_id"   
        });        
    }
    return AdminUser;
}
module.exports = bertedecoData