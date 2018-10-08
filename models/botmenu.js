'use strict';
module.exports = (sequelize, DataTypes) => {
  const BotMenu = sequelize.define('BotMenu', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    text: DataTypes.TEXT,
    pid: DataTypes.INTEGER
  }, {});
  BotMenu.associate = function (models) {
    // associations can be defined here
  };
  return BotMenu;
};