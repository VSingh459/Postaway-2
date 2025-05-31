import CommentRepository from "./comment.repository.js";
import mongoose from 'mongoose';

export default class CommentController
{
    adding(req,res)
    {
        const postId = req.params.postId;
        const userId = req.user.userId;
        const comment = req.body.comment;

        return  CommentRepository.addo(userId,postId,comment).then(function(result){
            res.status(201).send(result);
        }).catch(function(error){
            console.error('Unexpected error in post controller:', error);
            res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });

        });
    }

    getAllComments(req, res) {
        const postId = req.params.postId; // Extract postId from request parameters
        const userId = req.user.userId;  // Extract userId from authenticated user (if required)
    
        // Validate postId
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ error: 'Invalid postId' });
        }
    
        return CommentRepository.getAllComments(postId)
            .then(function(comments) {
                if (!comments || comments.length === 0) {
                    return res.status(404).json({ message: 'No comments found for this post.' });
                }
                res.status(200).send(comments);
            })
            .catch(function(error) {
                console.error('Error fetching comments in Controller:', error);
                res.status(500).json({ error: 'Failed to fetch comments. Please try again later.' });
            });
    }

    deletion(req,res)
    {
        const userId = req.user.userId;
        const commentId = req.params.commentId;

        return CommentRepository.deletion(userId,commentId).then(function(result){
            if (result === true)
            {
                res.status(204).send();
            }
            else
            {
                res.status(404).send({message: 'Not Found'});
            }
            
        }).catch(function(error){
            console.error('Unexpected error in Comment controller:', error);
            res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });

        })
    }

    updation(req, res) {
        const userId = req.user.userId; // Extract userId from the authenticated user
        const commentId = req.params.commentId; // Extract commentId from request params
        const data = req.body.data; // Extract data from the request body
    
        // Validate input: Check for empty or missing fields
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ error: 'Invalid commentId format' });
        }
        if (!data || data.trim().length === 0) {
            return res.status(400).json({ error: 'Comment content cannot be empty' });
        }
    
        const updateData = { data }; // Create the update object
    
        // Call the repository function to update the comment
        return CommentRepository.updater(userId, commentId, updateData)
            .then(function (result) {
                if (!result) {
                    return res.status(404).json({ error: 'Comment not found or unauthorized' });
                }
                res.status(200).json({
                    message: 'Comment updated successfully',
                    updatedComment: result,
                });
            })
            .catch(function (error) {
                console.error('Unexpected error in Comment controller:', error);
                res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
            });
    }
    
    
}