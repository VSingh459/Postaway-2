
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import userSchema from './user.schema.js';
import UserRepository from './user.repository.js'; 
import { ApplicationError } from '../../error-handler/applicationError.js';
import blackListSchema from './blacklist.schema.js';

// Create the Mongoose model
const userSN = mongoose.model('User', userSchema);


export default class UserModel {
    static signup(name, email, gender, password) {

        if (
            typeof password !== 'string' ||
            password.length < 8 ||
            password.length > 25 ||
            !/[!@#$%^&*(),.?":{}|<>]/.test(password)
        ) {
            const error = new ApplicationError('Password should be between 8-25 characters and have a special character',400);
            throw error;
        }
        
        return bcrypt.hash(password, 12)
            .then(function (hashedPassword) {

                return UserRepository.createUser(name,email,gender,hashedPassword);
            }).catch(function(error){
                if (error.code === 11000) { // This is mongodb duplicate error code
                    throw new ApplicationError(`The email ${email} is already registered.`, 400);
                }
                console.error('There is error signing Up User: ',error);
                throw error;
            });    
    }

    static logout(toekn)
    {
        
    }
}
