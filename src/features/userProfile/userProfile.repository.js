import userProfileSchema from  './userProfile.schema.js';
import mongoose from 'mongoose';

const profile = mongoose.model('profile', userProfileSchema);

export default class UserRepository
{
    static adderPro(obj)
    {
        const newProfile = new profile(obj);
        return newProfile.save().then(function(result){
            return result;
        }).catch(function(error){
            console.error('There is error in repo or database: ',error);
            throw error;
        });
    }

    static getProfile(userId)
    {
        return profile.findOne({userId}).then(function(result){
            return result;
        }).catch(function(error){
            console.error('There is error in profile Repo or database: ',error);
            throw error;
        });
    }

    static getDetails4All(username)
    {
        return profile.findOne({username}).then(function(result){
            return result;
        }).catch(function(error){
            console.error('There is error in database or repo ',error);
            throw error;
        });
    }

    static updateProfile(userId, updateData) {
        return profile
            .findOneAndUpdate({ userId }, updateData, { new: true, runValidators: true })
            .then(function (updatedProfile) {
                return updatedProfile; // Return the updated profile
            })
            .catch(function (error) {
                console.error('Error in updateProfile repository:', error);
                throw error; // Throw error to be handled by the controller
            });
    }
    
}