'use strict';
module.exports = (sequelize, DataTypes) => {
  const TelegramUser = sequelize.define('TelegramUser', {
    chat_id: DataTypes.INTEGER,
    full_name: DataTypes.STRING,
    username: DataTypes.STRING,
    steps: DataTypes.ARRAY(DataTypes.INTEGER),
    temp_orders: DataTypes.ARRAY(DataTypes.STRING),
    phone: DataTypes.STRING
  }, {});
  TelegramUser.associate = function (models) {
    // associations can be defined here
  };
  return TelegramUser;
};