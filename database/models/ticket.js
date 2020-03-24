'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    status: { 
      type: DataTypes.STRING, 
      defaultValue: 'open' 
    },
    request: DataTypes.TEXT,
    closedDate: {
      allowNull: true,
      type: DataTypes.DATE
    },
    assignedToId: DataTypes.INTEGER
  }, {});
  Ticket.associate = (models) => {
    Ticket.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    })
    Ticket.hasMany(models.Comment, {
      foreignKey: 'ticketId',
      as: 'comments'
    })
  };
  return Ticket;
};