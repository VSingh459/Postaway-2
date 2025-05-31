import express from 'express';
import otpController from './otp.controller.js';

const otpRouter = express.Router();
var controller = new otpController();

// Route for requesting OTP
otpRouter.post('/request-otp', function (req, res) {
    controller.oneTimePassword(req, res);
});

otpRouter.post('/reset-password', controller.reset);

export default otpRouter;
