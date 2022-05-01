const fs = require('fs');
const path = require('path')

class MigrationManager {
    async migrate(sequelize, Migration) {
        console.log(`Migration Start`)
        let actualMigration = await Migration.findOne();
        const now = new Date()
        
        if (actualMigration === null) {
            actualMigration = await Migration.create({migration: now})
        }

        let reference = actualMigration === null ? now : actualMigration.migration.getTime()

        const files = fs.readdirSync(path.join(__dirname, '/../migrations'))

        const validFiles = files.map(i => parseInt(path.basename(i))).filter(i => i > reference);

        if (validFiles.length === 0) {
            console.log('No migration to execute')

            return;
        }

        let lastFile = null

        const loop = async (index = 0) => {
            if (index >= validFiles.length) {
                return;
            }
            lastFile = validFiles[index];
            const queries = require(path.join(__dirname, '/../migrations/', validFiles[index].toString()))
            console.log(`Executing migration '${validFiles[index]}'`)

            for (const query of queries) {
                console.log('QUERY', validFiles[index].toString(), query)
                await sequelize.query(query);
            }

            return await loop(index  + 1);
        } 

        await loop()

        if (validFiles.length > 0) {
            await Migration.update({migration: lastFile}, {where:{id: actualMigration.id}})
        }

        console.log(`Migration End`)
    }
}

const migrationManager = new MigrationManager()

module.exports = migrationManager;