const express = require('express');
const router = express.Router();
const authController = require('./../controllers/Authentication');
const validateRegistration = require('./../middlewares/registerUserValidator');
const validateLogin = require('./../middlewares/loginUserValidator');
const validateResetPassword = require('../middlewares/resetPasswordValidator');
const validatecompletePasswordReset = require('../middlewares/completePasswodReset');

router.post('/auth/register', validateRegistration, authController.register);

router.post('/auth/login', validateLogin, authController.login);

router.post('/auth/resetPassword', validateResetPassword, authController.passwordReset);

router.patch('/auth/resetPassword', validatecompletePasswordReset, authController.completePasswordReset);

module.exports = router;