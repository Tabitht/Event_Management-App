const { scrypt, randomBytes, timingSafeEqual, randomInt } = require('node:crypto')

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

async function generateOTP(){
    return new Promise((resolve, reject) => {
        randomInt(100000, 999999, (error, number) => {
            if (error) {
                reject(error)
            };

            resolve(number);
        });
    });
};
module.exports = {
    hashPassword,
<<<<<<< HEAD
    compareHash,
    generateOTP
}
=======
    compareHash
}
>>>>>>> refs/remotes/origin/main
