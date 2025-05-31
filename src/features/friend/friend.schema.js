import mongoose from 'mongoose';

const friendSchema = new mongoose.Schema({

    sender: {
         type:  mongoose.Schema.Types.ObjectId,
         ref: 'user',
        required: true
    },

    to: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    status: { 
        type: String, 
        required: true,
        enum: ['Undecided', 'Accept', 'Reject'], // Restricts values to these options
        default: 'Undecided' // Sets the default value to 'Undecided'
    }
});

const friend = mongoose.model('friend',friendSchema);
export default friend;