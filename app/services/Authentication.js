const ULID = require('ulid');
const jwt = require('jsonwebtoken');

const { addSeconds, getTime, format, formatISO } = require('date-fns');
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
        { email: Email }
    )

    if (User === null) {
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
            id: User.id
        },
        process.env.APP_KEY,
        {
            issuer: process.env.JWT_TOKEN_ISSUER,
            notBefore: '0s'
        }
    );

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
        throw new Error('User credentials do not match our records');
    }

    const oneTimePasswordCollection = await database.connect('one_time-passwords')

    const expiryDate = addseconds(new Date(), (15 * 60));

    let token;

    do{
        token = await generateOTP();

        const duplicates = await oneTimePasswordCollection.countDocuments({ 'token': token })
    } while (duplicates > 0);

    await oneTimePasswordCollection.insertOne({
        id: ULID.ulid(),
        user_id: user.id,
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
module.exports = {
    registerUser,
    loginUser,
    initiatePasswordReset
}
