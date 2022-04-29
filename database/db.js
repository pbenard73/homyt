const { Sequelize } = require('sequelize');
const initUser = require('./models/user')



class Database {
    models = {}
    sequelize = null

    async init() {
        const sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: `${__dirname}/db.sqlite`
        });

        const User = initUser(sequelize)
        this.models.user = User;

        await sequelize.sync();

        this.sequelize = sequelize;
    }
}

const database = new Database()

module.exports = database;
