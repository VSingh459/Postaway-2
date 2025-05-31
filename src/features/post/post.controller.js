import PostRepository from './post.repository.js';

export default class PostController{

    createPost(req,res)
    {
        const userId = req.user.userId;
        const cap = req.body.caption;
        const imageUrl = req.file.filename;

        return PostRepository.creation(userId,cap,imageUrl).then(function(result){
            res.status(201).send(result);
        }).catch(function(error){
            console.error('Unexpected error in Post controller:', error);
            res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
        })
    }

    delete(req,res)
    {
        const userId = req.user.userId;
        const postId = req.query.postId;

        return PostRepository.deletion(userId,postId).then(function(result){
            if (result === true)
            {
                res.status(204).send();
            }
            else
            {
                res.status(404).send({message: 'Not Found'});
            }
            
        }).catch(function(error){
            console.error('Unexpected error in post controller:', error);
            res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });

        })
    }

    update(req, res) {
        const userId = req.user.userId;
        const postId = req.query.postId;
    
        const caption = req.body.caption;
        const imageUrl = req.file ? req.file.filename : null;

        const updateData = {};
        if (caption) updateData.caption = caption;
        if (imageUrl) updateData.imageUrl = imageUrl;
    
        // Use your brain
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'No fields provided to update.' });
        }
    
        return PostRepository.updation(userId, postId, updateData)
            .then(function (result) {
                if (result) {
                    res.status(200).json({ message: 'Post updated successfully', updatedPost: result });
                } else {
                    res.status(404).json({ error: 'Post not found or unauthorized' });
                }
            })
            .catch(function (error) {
                console.error('Unexpected error in post controller:', error);
                res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
            });
    }

    getPostById(req, res) {
        const userId = req.user.userId;
        const postId = req.params.postId;
    
        return PostRepository.posterById(userId, postId)
            .then(function (result) {
                if (!result) {
                    return res.status(404).json({ error: 'Post not found or unauthorized' }); 
                }
                res.status(200).send(result); 
            })
            .catch(function (error) {
                console.error('Unexpected error in post controller:', error);
                res.status(500).json({ error: 'An unexpected error occurred. Please try again.' }); 
            });
    }

    aller(req, res) {
        const userId = req.user.userId;
    
        return PostRepository.allPosts(userId)
            .then(function (result) {
                if (!result || result.length === 0) {
                   
                    return res.status(404).json({ message: 'No posts found for this user.' });
                }
                
                res.status(200).json(result);
            })
            .catch(function (error) {
                console.error('Unexpected error in post controller:', error);
                res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
            });
    }

    allPostsByUserIds(req, res) {
        console.log('hhhhhh');
        
        const userIds = Object.values(req.body);
    
        if (!Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ error: 'No userIds provided in the request.' });
        }
    
        return PostRepository.allPostsByUserIds(userIds)
            .then(function (posts) {
                if (!posts || posts.length === 0) {
                    return res.status(404).json({ message: 'No posts found for the provided userIds.' });
                }
                res.status(200).json(posts); // Send retrieved posts
            })
            .catch(function (error) {
                console.error('Unexpected error in post controller:', error);
                res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
            });
    }
    
    
    
    

}