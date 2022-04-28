const { Sequelize } = require('sequelize');
const initUser = require('./models/user')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: `${__dirname}/db.sqlite`
});

class Database {
    models = {}

    async init() {
        const User = initUser(sequelize)
        this.models.user = User;

        await sequelize.sync();
    }
}

const database = new Database()

database.sequelize = sequelize;

module.exports = database;
