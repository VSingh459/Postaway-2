import otpRepository from './otp.repository.js';
import nodemailer from 'nodemailer';
import otpSchema from './otp.schema.js';
import mongoose from 'mongoose';

const otp = mongoose.model('otp', otpSchema);

export default class OtpModel {
    /**
     * Generate and send OTP to the user's email.
     * Deletes older OTPs for the same userId and creates a new one.
     */
    static otpSending(userId, callback) {
        otpRepository.getEmail(userId)
            .then(function (user) {
                if (!user || !user.email) {
                    return callback(new Error('User email not found'));
                }

                // Generate a 6-digit OTP
                const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
                console.log('Generated OTP:', otpCode);

                // Delete existing OTPs for the user before creating a new one
                otpRepository.deleteOtpsForUser(userId)
                    .then(function () {
                        // Create an instance of the OTP schema
                        const otpDocument = new otp({
                            userId: user._id,
                            otpCode: otpCode,
                            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Expires in 5 minutes
                            attempts: 0,
                            isUsed: false,
                        });

                        // Save the new OTP document
                        otpDocument.save()
                            .then(function () {
                                // Create Ethereal test account
                                nodemailer.createTestAccount(function (err, testAccount) {
                                    if (err) {
                                        console.error('Failed to create Ethereal account:', err);
                                        return callback(err);
                                    }

                                    const transporter = nodemailer.createTransport({
                                        host: 'smtp.ethereal.email',
                                        port: 587,
                                        auth: {
                                            user: 'annamarie21@ethereal.email',
                                            pass: 'BXZCHGrnTtmFHX9Js4'
                                        }
                                    });

                                    const mailOptions = {
                                        from: '"Test OTP Service" <no-reply@test.com>',
                                        to: user.email, // Send to the user's email
                                        subject: 'Your OTP for Password Reset',
                                        text: `Your OTP is ${otpCode}. It is valid for 5 minutes.`,
                                    };

                                    transporter.sendMail(mailOptions, function (error, info) {
                                        if (error) {
                                            console.error('Error sending OTP email:', error);
                                            return callback(error);
                                        } else {
                                            console.log('Email sent: ' + nodemailer.getTestMessageUrl(info));
                                            callback(null, `OTP sent successfully. Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
                                        }
                                    });
                                });
                            })
                            .catch(function (repoError) {
                                console.error('Error saving OTP to the database:', repoError);
                                callback(repoError);
                            });
                    })
                    .catch(function (deleteError) {
                        console.error('Error deleting existing OTPs:', deleteError);
                        callback(deleteError);
                    });
            })
            .catch(function (error) {
                console.error('Error in retrieving email:', error);
                callback(error);
            });
    }
}

