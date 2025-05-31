import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {type: String, 
        required: true, 
        maxLength: [25,"Name can't be greater than 25 characters"]
    },
    email: { 
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(v);
            },
            message: props => `${props.value} is not a valid email address!`,
        },
    },
    password: {
        type: String, 
        required: true,
    },
    gender: { 
        type: String, 
        required: true,
        enum: ['Male', 'Female']
    }
});

export default userSchema;

