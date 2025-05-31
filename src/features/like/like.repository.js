import mongoose from 'mongoose';
import like from './like.schema.js';
import post from '../post/post.schema.js';

export default class LikeRepository
{

    static addLike(userId, postId, opinion) {
        // Verify if the post exists and check if the user is the owner
        return post.findOne({ _id: new mongoose.Types.ObjectId(postId) })
            .then(function (post) {
                if (!post) {
                    // If the post does not exist, return an error
                    return { postExists: false };
                }

                if (post.userId.toString() === userId) {
                    // If the user is the owner of the post, they cannot like/dislike it
                    return { postExists: true, isOwner: true };
                }

                // Check if a like/unlike already exists for the user on the post
                return like.findOne({ userId: new mongoose.Types.ObjectId(userId), postId: new mongoose.Types.ObjectId(postId) })
                    .then(function (existingLike) {
                        if (existingLike) {
                            return { postExists: true, isOwner: false, alreadyExists: true };
                        }

                        // Add a new like/unlike
                        const newLike = new like({ userId: userId, postId: postId, opinion: opinion });
                        return newLike.save().then(function (savedLike) {
                            return { postExists: true, isOwner: false, alreadyExists: false, like: savedLike };
                        });
                    });
            })
            .catch(function (error) {
                console.error('Error in addLike repository:', error);
                throw error;
            });
    }

    static getAllLikesAndUnlikes(postId) {
        return like.aggregate([
            { $match: { postId: new mongoose.Types.ObjectId(postId) } },
            {
                $group: {
                    _id: "$opinion",
                    count: { $sum: 1 }
                }
            }
        ])
        .then(function (result) {
            if (!result.length) {
                return null;
            }
            const likes = result.find(item => item._id === "Like")?.count || 0;
            const unlikes = result.find(item => item._id === "Unlike")?.count || 0;
            return { postId, likes, unlikes };
        })
        .catch(function (error) {
            console.error('Error in getAllLikesAndUnlikes repository:', error);
            throw error;
        });
    }
    

}