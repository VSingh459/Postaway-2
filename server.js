import exp from 'express';
import dotenv from 'dotenv';
import swagger from 'swagger-ui-express';
import apiDocs from './swagger.json' assert {type: 'json'};

import uRouter from './src/features/user/user.routes.js';
import loggerMiddleware from './src/middleware/logger.middleware.js';
import { connectUsingMongoose } from './src/config/mongooseConfig.js';
import {logger} from './src/middleware/logger.middleware.js';
import { ApplicationError } from './src/error-handler/applicationError.js';
import pRouter from './src/features/userProfile/userProfile.routes.js';
import jwtAuth from './src/middleware/jwt.middleware.js';
import otpRouter from './src/features/otp/otp.routes.js';
import postRouter from './src/features/post/post.routes.js';
import cRouter from './src/features/comment/comment.routes.js';
import likeRouter from './src/features/like/like.routes.js';
import fRouter from './src/features/friend/friend.routes.js';

const server =  exp();
dotenv.config();
server.use(loggerMiddleware);
server.use(exp.json());
server.use(exp.urlencoded({ extended: true }));
server.use('/api-docs',swagger.serve,swagger.setup(apiDocs));


server.use('/api/users', uRouter);
server.use('/api/profile', jwtAuth, pRouter);
server.use('/api/otp', jwtAuth, otpRouter);
server.use('/api/posts',jwtAuth,postRouter);
server.use('/api/comments',jwtAuth, cRouter);
server.use('/api/likes',jwtAuth, likeRouter);
server.use('/api/friend',jwtAuth, fRouter);

//Middleware to handle 404 requests
server.use((req,res)=>{
    res.status(404).send("API not found");
});

// Error Handler middleware
server.use((err, req, res, next) => {
    // Log the error details
    logger.error({
        message: err.message,
        stack: err.stack,
        statusCode: err.code || 500,
        path: req.url,
        method: req.method,
    });

    // Respond to the client
    if (err instanceof ApplicationError) {
        res.status(err.statusCode).send(err.message);
    } else {
        console.log('asdasd');
        res.status(500).send('Something went Wrong. Please try again later!!!');
    }
});


let a = connectUsingMongoose(); 

a.then(function () {
    server.listen(3300, function () {
        console.log('Server is listening at port-3300');
    });
})
.catch(function (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); 
});