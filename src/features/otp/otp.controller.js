import OtpModel from './otp.model.js';
import OtpRepository from './otp.repository.js';

export default class OtpController {
    oneTimePassword(req, res) {
        try {
            // Extract userId from the request
            var userId = req.user.userId; // Assuming `req.user` contains the decoded JWT token with userId
            
            // Call the OTP model to handle the OTP generation and sending
            OtpModel.otpSending(userId, function (err, email) {
                if (err) {
                    console.error('Error in sending OTP:', err);
                    res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
                } else {
                    console.log('OTP sent successfully to:', email);
                    res.status(200).json({ message: 'OTP sent successfully', email: email });
                }
            });
        } catch (error) {
            console.error('Unexpected error in OTP controller:', error);
            res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
        }
    }

    reset(req, res) {
        const otp = req.body.otp;
        const password = req.body.password;
        const userId = req.user.userId;
    
        OtpRepository.passReset(userId, otp, password)
            .then(function (result) {
                res.status(200).json({
                    message: result, 
                });
            })
            .catch(function (error) {
                console.error('Error during password reset:', error.message);
                res.status(400).json({
                    error: error.message, 
                });
            });
    }
    
}
