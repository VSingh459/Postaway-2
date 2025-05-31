import express from 'express';
import PostController from './post.controller.js';
import {upload} from '../../middleware/fileUpload.middleware.js';

const postRouter = express.Router();
const poCont = new PostController();

postRouter.post('/add',upload.single('imageUrl'),poCont.createPost);
postRouter.delete('/delete',poCont.delete);
postRouter.put('/update',upload.single('imageUrl'),poCont.update);
postRouter.get('/:postId', poCont.getPostById);
postRouter.post('/all', poCont.allPostsByUserIds);
postRouter.get('/', poCont.aller);




export default postRouter;