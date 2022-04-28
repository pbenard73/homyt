const bcrypt = require('bcrypt');
const database = require('./../database/db')
const saltRounds = 12;

class UserManager {
    encrypt(givenPassword) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(givenPassword, saltRounds, (err, hash) => {
                if (err) {
                    return reject(err)
                }
                
                resolve(hash)
            });

        })
    }

    login(req, username, password) {
        return new Promise((resolve, reject) => {
            database.models.user.findOne({where: { username }, raw:true})
            .then(user => {
                if (!user){
                    return resolve(false)
                }
                
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        return reject(err)
                    }
    
                    if (result === true) {
                        req.session.user = user;
                        return resolve({valid: true, user: {...user, password: undefined}})
                    }

                    resolve(result)
                });
            })
            .catch(reject)    
        })
    }

    async createUser(username, givenPassword) {
        const password = await this.encrypt(givenPassword)

        return database.models.user.create({username, password})
    }

}

const userManager = new UserManager()

module.exports = userManager