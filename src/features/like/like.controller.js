import mongoose from 'mongoose';
import LikeRepository from './like.repository.js';

export default class LikeController {
    
    addition(req, res) {
        console.log('Helloooo');
        const userId = req.user.userId;
        const postId = req.params.postId;
        const opinion = req.body.opinion; 
    
        LikeRepository.addLike(userId, postId, opinion)
            .then(function (result) {
                if (!result.postExists) {
                    return res.status(404).json({ error: 'Post does not exist.' });
                }
    
                if (result.alreadyExists) {
                    return res.status(400).json({ error: 'User has already reacted to this post.' });
                }
    
                res.status(201).json({ message: 'Opinion added successfully.', like: result.like });
            })
            .catch(function (error) {
                console.error('Error while processing the request:', error);
                res.status(500).json({ error: 'Failed to process opinion. Please try again.' });
            });
    }

    allGet(req, res) {
        const postId = req.params.id;
    
        LikeRepository.getAllLikesAndUnlikes(postId)
            .then(function (result) {
                if (!result) {
                    return res.status(404).json({ error: 'Post not found or no reactions available.' });
                }
                res.status(200).json(result);
            })
            .catch(function (error) {
                console.error('Error retrieving likes/unlikes:', error);
                res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
            });
    }
    
    
}
