const crypto = require('node:crypto')
const number = crypto.randomBytes(32).toString("hex");
console.log(number);