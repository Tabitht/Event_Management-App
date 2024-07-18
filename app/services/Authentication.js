const ULID = require('ulid');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('node:crypto');
const { addSeconds, getTime, format, formatISO, parseISO, isPast } = require('date-fns');
const { hashPassword, compareHash, generateOTP } = require('./../utilities/hash')

const database = require('../../config/database');
const transporter = require('../../config/mail');

async function registerUser(userData) {
    const collection = await database.connect('Users');

    const existingUser = await collection.findOne(
        { email: userData.email }
    )

    if (existingUser) {
        throw new Error('User already exists');
    }

    const today = new Date();

    let password = await hashPassword(userData.password);

    const results = await collection.insertOne({
        id: ULID.ulid(),
        full_name: userData.full_name,
        email: userData.email,
        password: password,
        created_at: format(today, 'yyyy-MM-dd')
    });

    return results;
}

async function loginUser(Email, password) {
    const collection = await database.connect('Users');
    const User = await collection.findOne(
        { email: Email.email }
    )
    if (!User) {
        throw new Error('User credentials do not match our records');
    }

    const comparePassword = await compareHash(password, User.password);
    
    if (comparePassword === false) {
        throw new Error('User credentials do not match our records');
    }
    
    const expiryDate = addSeconds(new Date(), process.env.JWT_TOKEN_EXPIRY);

    const token = jwt.sign(
        {
            exp: Math.floor(getTime(expiryDate) / 1000),
            email: User.email,
            user_id: User.id
        },
        process.env.APP_KEY,
        {
            issuer: process.env.JWT_TOKEN_ISSUER,
            notBefore: '0s'
        }
    );
    console.log(User.email)
    return {
        user: {
            id: User.id,
            email: User.email,
            full_name: User.full_name,
            created_at: User.created_at
        },
        jwt: {
            token: token,
            expires_at: formatISO(expiryDate)
        }
    };
}
async function initiatePasswordReset(Email){
    const collection = await database.connect('Users');

    const User = await collection.findOne(
        { email: Email }
    )

    if (User === null) {
        error = new Error('User credentials do not match our records');
        error.statusCode = 404;
        throw error;
    }

    const oneTimePasswordCollection = await database.connect('one_time-passwords');
    await oneTimePasswordCollection.deleteMany({'user_id': User.id});

    const expiryDate = addSeconds(new Date(), (15 * 60));

    let token, duplicates;

    do{
        token = randomBytes(4).toString('hex');

        duplicates = await oneTimePasswordCollection.countDocuments({ 'token': token })
    } while (duplicates > 0);

    await oneTimePasswordCollection.insertOne({
        id: ULID.ulid(),
        user_id: User.id,
        token: token,
        expires_at: formatISO(expiryDate)
    });

    try{   
        await transporter.sendMail({
             from: process.env.MAIL_SECURITY_FROM,
            to: User.email, 
            subject: "Password Reset Request",
            text: `We received a request to intiate a password reset for your account. your OTP is ${token}`
    });
    } catch (error) {
        console.log(error);
    }
    return {
        message: `You will receive an email with password reset instuctions if an account is found for: ${Email}`
    };
}
async function resetPassword(token, password){
    const oneTimePasswordCollection = await database.connect('one_time-passwords');
    const otp = await oneTimePasswordCollection.findOne({ 'token': token });

    if (otp === null){
        error = new Error('invalid OTP provided');
        error.statusCode = 404;
        throw error;
    }
    let parsedDate = parseISO(otp.expires_at);
    
    if (isPast(parsedDate)) {
        oneTimePasswordCollection.deleteOne({'id': otp.id})
        error = new Error('OTP has expired');
        error.statusCode = 403;
        throw error;
    }
    const Users = await database.connect('Users');
    const hashedPassword = await hashPassword(password);

    await Users.findOneAndUpdate(
        {'id': otp.user_id},
        {$set: {"password": hashedPassword } }
    );
    return {
        message: `password reset successful`
    }
}
module.exports = {
    registerUser,
    loginUser,
    initiatePasswordReset,
    resetPassword
}
