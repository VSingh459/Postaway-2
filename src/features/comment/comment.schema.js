import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({

    postId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'post',
        required: true
    },

    userId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    data: {
        type: String,
        required: true
    }

});

const comment = mongoose.model('comment', commentSchema);
export default comment;