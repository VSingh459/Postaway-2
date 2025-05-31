import express from 'express';
import CommentController from './comment.controller.js';

const cRouter = express.Router();
const commer = new CommentController();

cRouter.get('/:postId', commer.getAllComments);
cRouter.post('/:postId',commer.adding);
cRouter.delete('/:commentId', commer.deletion);
cRouter.put('/:commentId', commer.updation);


export default cRouter;