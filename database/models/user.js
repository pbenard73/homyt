const { DataTypes } = require('sequelize');

const userModel = {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.STRING
  },
  theme: {
    type: DataTypes.STRING
  },
  background: {
    type: DataTypes.STRING
  },
  settings: {
    type: DataTypes.JSON
  }
}

const initUser = sequelize => sequelize.define('User', userModel, {tableName: 'users'})

module.exports = initUser;