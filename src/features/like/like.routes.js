import express from 'express';
import LikeController from './like.controller.js';

const likeRouter = express.Router();
const liker = new LikeController();

likeRouter.post('/toggle/:postId', liker.addition);
likeRouter.get('/:id', liker.allGet);

export default likeRouter;