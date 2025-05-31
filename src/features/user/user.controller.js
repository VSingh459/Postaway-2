import UserModel from './user.model.js';
import {ApplicationError} from '../../error-handler/applicationError.js';
import UserRepository from './user.repository.js';
import jwt from 'jsonwebtoken';

export default class UserController {
    signup(req, res) {
        const name = req.body.name;
        const email = req.body.email;
        const gender = req.body.gender;
        const password = req.body.password;

        // Validate input
    if (!name || !email || !gender || !password) {
       // return res.status(400).send("All fields are required.");
       const error = new ApplicationError("All fields are required.", 400);
            throw error;
    }

        const r = UserModel.signup(name, email, gender, password)
        .then(function(result){
            res.status(201).send(result);
        }).catch(function(error){
            if (error instanceof ApplicationError) {
                return res.status(error.statusCode).send({ message: error.message });
            }
            console.error('There is some error in controller signup:', error);
            res.status(500).send({ message: 'An internal server error occurred.' });
        });
    }


    signin(req, res) {
        const email = req.body.email;
        const password = req.body.password;
    
        // Validate inputs
        if (!email || !password) {
            const error = new ApplicationError("Email and password are required.", 400);
            throw error; // This should be caught by global error handling middleware
        }
    
        UserRepository.login(email, password)
            .then(function (user) {
                // UserRepository.login already ensures valid credentials
                const token = jwt.sign(
                    {
                        userId: user._id,
                        email: user.email,
                    },
                    process.env.JWT_SECRET, 
                    { expiresIn: '1h' } 
                );
                return res.status(200).send(token);  
            })
            .catch(function (error) {
                if (error instanceof ApplicationError) {
                    return res.status(error.statusCode).send(error.message);
                }
                console.error('Error in signin controller:', error);
                return res.status(500).send('An error occurred while signing in.');
            });
    }

    logout(req,res)
    {
        //const token = req.headers.authorization?.split(' ')[1]; 
        const token = req.headers.authorization;
        if (!token) {
            return res.status(400).send({ message: 'Token is required for logout.' });
        }

        const decoded = jwt.decode(token);

        if (!decoded || !decoded.exp) {
            return res.status(400).send({ message: 'Invalid token provided.' });
        }
    
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp < now) {
            return res.status(400).send({ message: 'Token has already expired.' });
        }

        const expiryTime = new Date(decoded.exp * 1000); 

        const ro = UserRepository.logout(token,expiryTime).then(function(result){
            res.status(200).send({ message: 'Successfully logged out.' });
        }).catch(function(error){
             console.error('Error during logout:', error);
            res.status(500).send({ message: 'An error occurred while processing your request. Please try again later.' });
        });
    }
}
