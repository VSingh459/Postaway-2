import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({

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

        opinion: { 
            type: String, 
            required: true,
            enum: ['Like', 'Unlike']
        }
});

const like = mongoose.model('like',likeSchema);
export default like;