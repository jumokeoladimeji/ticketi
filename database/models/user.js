'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    role: { type: DataTypes.STRING, 
      defaultValue: 'customer' },
    hashedPassword: DataTypes.STRING
  }, {});
  User.associate = (models) => {
    User.hasMany(models.Ticket, {
      foreignKey: 'userId',
      as: 'tickets'
    })
    User.hasMany(models.Comment, {
      foreignKey: 'userId',
      as: 'comments'
    })
  };
  return User;
};