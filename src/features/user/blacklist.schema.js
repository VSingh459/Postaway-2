import mongoose from 'mongoose';

const blackListSchema = new mongoose.Schema({
    
    token: {type: String,
        required: true,
        unique: true
    },

    expiresAt: {
        type: Date,
        required: true,
    }
});

blackListSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default blackListSchema;