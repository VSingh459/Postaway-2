import express from 'express';
import FriendController from './friend.controller.js';

const fRouter = express.Router();
const frie = new FriendController();

fRouter.post('/send/:to', frie.sending);
fRouter.get('/pending-requests',frie.pending);
fRouter.post('/response-to-request/:friendId', frie.reser);
fRouter.get('/get-friends/:userId', frie.getFriends);

export default fRouter;