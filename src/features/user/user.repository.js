import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {ApplicationError} from '../../error-handler/applicationError.js';
import blackListSchema from './blacklist.schema.js';

import userSchema from './user.schema.js';

const user = mongoose.model('user', userSchema);
const blacklist = mongoose.model('block',blackListSchema);

export default class UserRepository
{
    static createUser(name,email,gender, password)
    {
        const uu = {
            name,
            email,
            gender,
            password
        }
        const newUser = new user(uu);
        return newUser.save()
            .then(function () {
                return newUser; // Return the saved user
            })
            .catch(function (error) {
                if (error.code === 11000) { 
                    throw new ApplicationError(`Duplicate entry: The email ${email} is already in use.`, 400);
                }
                console.error("There is error in repo: ",error); 
                throw error;
            });
        
    }

    static login(email, password) {
        return user.findOne({ email: email })
            .then(function (user) {
                if (!user) {
                    // Email does not exist in the database
                    throw new ApplicationError('User not found', 400);
                }
                // Compare the provided password with the hashed password in the database
                return bcrypt.compare(password, user.password)
                    .then(function (isMatch) {
                        if (isMatch) {
                            return user; 
                        } else {
                            throw new Error('Incorrect password');
                        }
                    });
            })
            .catch(function (err) {
                console.log('Error in signIn:', err.message);
                throw err; 
            });
    }

    static logout(token,expiryTime)
    {
        const obj = {
            token,
            expiresAt: expiryTime
        };

        return blacklist.findOne({ token })
        .then(function (existingEntry) {
            if (existingEntry) {
                console.log('Token is already blacklisted.');
                return existingEntry; // Return the existing entry
            }

            // Add the token to the blacklist
            const blacklistEntry = new blacklist(obj);

            return blacklistEntry.save().then(function (result) {
                return result;
            });
        })
        .catch(function (err) {
            console.error('Error during logout process:', err);
            throw err; // Pass the error back to the controller
        });
        
    }

}

