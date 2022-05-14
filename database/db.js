const { Sequelize } = require('sequelize');
const initUser = require('./models/user')
const initMigration = require('./models/migration')
const migrationManager = require('./../managers/migration')


class Database {
    models = {}
    sequelize = null

    async init() {
        const sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: `${__dirname}/db.sqlite`
        });

        const Migration = initMigration(sequelize);
        await sequelize.sync();
        await migrationManager.migrate(sequelize, Migration);

        const User = initUser(sequelize)
        this.models.user = User;

        await sequelize.sync();

        this.sequelize = sequelize;
    }
}

const database = new Database()

module.exports = database;
