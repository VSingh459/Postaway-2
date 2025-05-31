import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', 
      required: true,
    },
    otpCode: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 5 * 60 * 1000), // Expires in 5 minutes
    },
    attempts: {
      type: Number,
      required: true,
      default: 0, // Tracks the number of incorrect attempts
    },
    isUsed: {
      type: Boolean,
      required: true,
      default: false, // Tracks whether the OTP is already used
    },
  });

export default  otpSchema;