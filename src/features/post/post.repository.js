import post from './post.schema.js';
import mongoose from 'mongoose';

export default class PostRepository
{
    static creation(userId,caption,imageUrl)
    {
        const obj = {
            userId: userId,
            caption: caption,
            imageUrl: imageUrl
        }

        const postBID = new post(obj);
        return postBID.save().then(function(result){
            return result;
        }).catch(function(error){
            console.error('There is error in repository: ', error);
            throw error;
        });  
    }

    static deletion(userId, postId) {
        return post.deleteOne({ _id: new mongoose.Types.ObjectId(postId), userId: userId })
            .then(function (result) {
                return result.deletedCount > 0; // True if the document was deleted
            })
            .catch(function (error) {
                console.error('Error deleting post:', error);
                throw error;
            });
    }

    static updation(userId, postId, updateData) {
        return post.findOneAndUpdate(
            { 
                _id: new mongoose.Types.ObjectId(postId), 
                userId: new mongoose.Types.ObjectId(userId) 
            },
            { 
                $set: updateData 
            },
            { 
                new: true, // Return the updated document
                runValidators: true // Validate the update against the schema
            }
        )
        .then(function (updatedPost) {
            if (!updatedPost) {
                console.log('Post not found or unauthorized');
                return null; 
            }
            console.log('Post updated successfully:', updatedPost);
            return updatedPost; // Return the updated post document
        })
        .catch(function (error) {
            console.error('Error updating post:', error);
            throw error; // Propagate error for controller to handle
        });
    }

    static posterById(userId, postId) {
        return post.findOne(
            { 
                _id: new mongoose.Types.ObjectId(postId), // Match postId
                userId: new mongoose.Types.ObjectId(userId) // Match userId
            }
        )
        .then(function (postDoc) {
            if (!postDoc) {
                console.log('Post not found or unauthorized');
                return null; 
            }
            return postDoc; 
        })
        .catch(function (error) {
            console.error('Error retrieving post:', error);
            throw error; 
        });
    }

    static allPosts(userId) {
        return post.find({ userId: new mongoose.Types.ObjectId(userId) }) 
            .then(function (posts) {
                return posts; 
            })
            .catch(function (error) {
                console.error('Error retrieving posts:', error);
                throw error; // Propagate error for controller to handle
            });
    }

    static allPostsByUserIds(userIds)
    {
        return post.find({ userId: { $in: userIds.map(id => new mongoose.Types.ObjectId(id)) } })
        .then(function (posts) {
            return posts; 
        })
        .catch(function (error) {
            console.error('Error retrieving posts for userIds:', error);
            throw error; // Propagate the error for the controller to handle
        });

    }
    
    
    
}