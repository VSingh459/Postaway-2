import exp from 'express';
import jwtAuth from '../../middleware/jwt.middleware.js';

import UserController from './user.controller.js';

const uRouter = exp.Router();
const uControl = new UserController();

uRouter.post('/signup', uControl.signup);
uRouter.post('/signin', uControl.signin);
uRouter.post('/logout', jwtAuth, uControl.logout);

export default uRouter;