const { scrypt, randomBytes, timingSafeEqual } = require('node:crypto')

const keyLength = 64;

async function hashPassword(password) {
    return new Promise((resolve, reject) => {

        const salt = randomBytes(16).toString("hex");

        scrypt(password, salt, keyLength, (error, derivedKey) => {
            if (error) {
                reject(error);
            }

            let hashedPassword = derivedKey.toString("hex")

            resolve(`${salt}.${hashedPassword}`);
        });
    }) 
}

async function compareHash(password, hash) {
    return new Promise((resolve, reject) => {

        const [salt, hashKey] = hash.split(".");
        const buffer = Buffer.from(hashKey, 'hex');

        scrypt(password, salt, keyLength, (error, derivedKey) => {
            if (error) {
                reject(error);
            }

            resolve(timingSafeEqual(buffer, derivedKey));
        });
    }); 
}
module.exports = {
    hashPassword,
    compareHash
}
