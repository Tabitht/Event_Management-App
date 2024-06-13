const express = require('express');
const router = express.Router();
const authController = require('./../controllers/Authentication');
const validateRegistration = require('./../middlewares/registerUserValidator');
const validateLogin = require('./../middlewares/loginUserValidator');

router.post('/auth/register', validateRegistration, authController.register);

router.post('/auth/login', validateLogin, authController.login);

module.exports = router;