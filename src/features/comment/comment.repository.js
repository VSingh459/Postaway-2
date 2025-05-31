import comment from './comment.schema.js';
import mongoose from 'mongoose';

export default class CommentRepository{

    static addo(userId,postId,data)
    {
        const obj = {
            postId: postId,
            userId: userId,
            data: data
        };

        const nCom = new comment(obj);
        return nCom.save().then(function(result){
            return result;
        }).catch(function(error){
            console.error('There is error in repository: ',error);
            throw error;
        });
    }

    static getAllComments(postId)
    {
        return comment.find({postId: new mongoose.Types.ObjectId(postId)}).then(function(arr){
            return arr;
        }).catch(function(error){
            console.error('There is error in repository: ',error);
            throw error;
        });
    }

    static deletion(userId, commentId)
    {
        return comment.deleteOne({ _id: new mongoose.Types.ObjectId(commentId), 
                                userId: new mongoose.Types.ObjectId(userId) })
            .then(function (result) {
                return result.deletedCount > 0; // True if the document was deleted
            })
            .catch(function (error) {
                console.error('Error deleting post:', error);
                throw error;
            });
    }

    static updater(userId, commentId, upData)
    {
        return comment.findOneAndUpdate(
            { 
                _id: new mongoose.Types.ObjectId(commentId), 
                userId: new mongoose.Types.ObjectId(userId) 
            },
            { 
                $set: upData
            },
            { 
                new: true, // Return the updated document
                runValidators: true // Validate the update against the schema
            }
        )
        .then(function (upData) {
            if (!upData) {
                console.log('Comment not found or unauthorized');
                return null; 
            }
            console.log('Comment updated successfully:', upData);
            return upData; // Return the updated post document
        })
        .catch(function (error) {
            console.error('Error updating comment in repo:', error);
            throw error; 
        });
    }
    
}