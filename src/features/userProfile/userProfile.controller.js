import ProfileModel from './userProfile.model.js';
import UserRepository from './userProfile.repository.js';
import ProfileRepository from './userProfile.repository.js';

export default class ProfileController{
    
    addProfile(req, res) {
        const { nickname, tagline, occupation, interests, username } = req.body;

        const avatar = req.file.filename;
    
        const obj = {
            nickname,
            avatar,
            tagline,
            occupation,
            interests,
            //userId: req.user._id,
            userId: req.user.userId,
            username
        };
    
        // Filter out undefined or null fields (optional but recommended)
        const sanitizedData = Object.fromEntries(
            Object.entries(obj).filter(([_, value]) => value != null) 
        );
    
        return ProfileRepository.adderPro(sanitizedData)
            .then(function(result) {
                res.status(200).send(result); 
            })
            .catch(function(error) {
                console.error('There is an error in the controller while adding profile:', error);
                res.status(500).send({ message: 'Failed to add profile.', error: error.message }); 
            });
    }

    getPDetails(req,res)
    {
        console.log('Hello Contro');
        const userId = req.user.userId;
        console.log('userId is = '+userId);
        return UserRepository.getProfile(userId)
        .then(function(response){
            if (response)
            {
                const obj = {
                    username: response.username,
                    nickname: response.nickname,
                    avatar: response.avatar,
                    tagline: response.tagline,
                    occupation: response.occupation
                }
                res.status(200).send(obj);
            }
            else{
                res.status(404).send({ message: 'Profile not found' });
            }
        }).catch(function(error){
            console.error('Error fetching profile details:', error);
            res.status(500).send({ message: 'An error occurred while retrieving the profile.' });
        });
    }

    getAllDetails(req,res)
    {
        const username = req.query.username;
        return UserRepository.getDetails4All(username).then(function(result){
            if (result)
            {
                const obj = {
                    username: result.username,
                    nickname: result.nickname,
                    avatar: result.avatar,
                    tagline: result.tagline,
                    occupation: result.occupation
                }
                res.status(200).send(obj);
            }
            else{
                res.status(404).send({ message: 'Profile not found/Wrong Username.' });
            }

        }).catch(function(error){
            console.error('There is error in controller: ',error);
            res.status(500).send({ message: 'An error occurred while retrieving the profile.' });
        });
    }

    updateProfile(req, res, next) {
        const userId = req.user.userId; // Extract userId from JWT token
        const { nickname, tagline, occupation, interests } = req.body;
    
        // Create an object with only the allowed fields to update
        const updateData = {
            nickname,
            tagline,
            occupation,
            interests,
        };
    
        // Filter out undefined fields
        const sanitizedData = Object.fromEntries(
            Object.entries(updateData).filter(([_, value]) => value != null)
        );
    
        // Ensure sensitive fields cannot be updated (userId and username are not part of sanitizedData)
        return ProfileRepository.updateProfile(userId, sanitizedData)
            .then(function (updatedProfile) {
                if (updatedProfile) {
                    const obj = {
                        username: updatedProfile.username,
                        nickname: updatedProfile.nickname,
                        avatar: updatedProfile.avatar,
                        tagline: updatedProfile.tagline,
                        occupation: updatedProfile.occupation
                    }
                    res.status(200).send(obj);
                } else {
                    res.status(404).send({ message: 'Profile not found' });
                }
            })
            .catch(function (error) {
                console.error('Error updating profile:', error);
                next(error); // Forward error to global error handler
            });
    }
    
    
}