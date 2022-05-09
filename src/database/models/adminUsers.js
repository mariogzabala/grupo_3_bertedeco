function bertedecoData (sequelize, DataTypes) {
    
    let alias = "AdminUsers";
    
    let cols = {    
        id: {type: DataTypes.INTEGER, primaryKey: true, autoincrement: true},
        password: {type: DataTypes.STRING(500), allowNull: false},
        first_name: {type: DataTypes.STRING(45), allowNull: false},
        last_name: {type: DataTypes.STRING(45), allowNull: false},
        createdAt: { type: DataTypes.DATE, field: 'created_at' },
        updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
        last_login: {type: DataTypes.DATE},
        email: {type: DataTypes.STRING(50)}
        
    }
    
    let config = {tableName: "admin_user", camelCase: false, underscored: true, timestamps: true}
    
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
