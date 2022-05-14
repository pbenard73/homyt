const { DataTypes } = require('sequelize');

const migrationModel = {
  migration: {
    type: DataTypes.DATE,
  },
}

const initMigration = sequelize => sequelize.define('Database', migrationModel, {tableName: 'migration'})

module.exports = initMigration;