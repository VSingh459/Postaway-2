import mongoose from 'mongoose';
import userSchema from '../user/user.schema.js'; 
import bcrypt from 'bcrypt';
import otpSchema from './otp.schema.js';

const otp = mongoose.model('otp', otpSchema);
const user = mongoose.model('user',userSchema);

export default class OtpRepository {
    /**
     * Retrieve a user's email by their userId.
     */
    static getEmail(userId) {
        return user.findOne({ _id: new mongoose.Types.ObjectId(userId) }).exec();
    }

    /**
     * Delete all OTP documents for a specific userId.
     */
    static deleteOtpsForUser(userId) {
        return otp.deleteMany({ userId: userId }).exec()
            .then(function () {
                console.log(`Deleted all OTPs for userId: ${userId}`);
            })
            .catch(function (error) {
                console.error(`Error deleting OTPs for userId: ${userId}`, error);
                throw error;
            });
    }

    /**
     * Save a new OTP document to the database.
     */
    static saveOtp(otpDocument) {
        const newOtp = new otp(otpDocument);
        return newOtp.save()
            .then(function () {
                console.log('New OTP saved successfully.');
            })
            .catch(function (error) {
                console.error('Error saving OTP:', error);
                throw error;
            });
    }

    /**
     * Retrieve the most recent OTP document for a specific userId.
     */
    static getMostRecentOtp(userId) {
        return otp.findOne({ userId: userId })
            .sort({ expiresAt: -1 }) // Sort by expiry date, descending
            .exec()
            .then(function (otpDoc) {
                if (!otpDoc) {
                    console.error(`No OTP record found for userId: ${userId}`);
                }
                return otpDoc;
            })
            .catch(function (error) {
                console.error('Error retrieving most recent OTP:', error);
                throw error;
            });
    }

    /**
     * Verify the OTP and reset the user's password.
     */
    static passReset(userId, otp, newPassword) {
        return this.getMostRecentOtp(userId)
            .then(function (otpDoc) {
                if (!otpDoc) {
                    throw new Error('No OTP record found for this user.');
                }

                // Validate OTP
                if (otpDoc.otpCode !== otp || otpDoc.isUsed) {
                    otpDoc.attempts = (otpDoc.attempts || 0) + 1;

                    if (otpDoc.attempts >= 3) {
                        return otpDoc.save().then(function () {
                            throw new Error('Maximum OTP attempts reached. Please request a new OTP.');
                        });
                    }

                    return otpDoc.save().then(function () {
                        throw new Error(`Wrong or invalid OTP. Attempts remaining: ${3 - otpDoc.attempts}`);
                    });
                }

                // Check if OTP has expired
                if (new Date() > otpDoc.expiresAt) {
                    throw new Error('OTP has expired. Please request a new OTP.');
                }

                // Mark OTP as used
                otpDoc.isUsed = true;

                // Find the user and update the password
                return user.findOne({ _id: new mongoose.Types.ObjectId(userId) }).then(async function (userDoc) {
                    if (!userDoc) {
                        throw new Error('User not found.');
                    }

                    // Hash the new password
                    const saltRounds = 12;
                    userDoc.password = await bcrypt.hash(newPassword, saltRounds);

                    // Save both userDoc and otpDoc concurrently
                    return Promise.all([userDoc.save(), otpDoc.save()]);
                });
            })
            .then(function () {
                console.log('Password reset successfully.');
                return 'Password reset successfully.';
            })
            .catch(function (error) {
                console.error('Error in passReset:', error.message);
                throw error;
            });
    }
}
