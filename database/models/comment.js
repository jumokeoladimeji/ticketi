'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: DataTypes.STRING
  }, {});
  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    })
    Comment.belongsTo(models.Ticket, {
      foreignKey: 'ticketId',
      onDelete: 'CASCADE'
    })
  };
  return Comment;
};
