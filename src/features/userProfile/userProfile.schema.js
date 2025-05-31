import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
    username: { type: String,
                required: true,
                unique: true
    },

    userId: { type: mongoose.Schema.Types.ObjectId,
               ref: 'user', 
               required: true },
    nickname: { type: String,
              required: true
    },
    avatar: {type: String,
        required: false
    },
    tagline: { type: String,
            required: false
    },
    occupation: { type: String,
            required: true
    },
    interests: { type: String,
              required: false
    }
});

export default userProfileSchema;