import ProfileController from "./userProfile.controller.js";
import {upload} from '../../middleware/fileUpload.middleware.js';
import exp from 'express';

const pRouter = exp.Router();
const pc = new ProfileController();

pRouter.post('/addProfile',upload.single('avatar'), pc.addProfile);
pRouter.get('/getProfile',upload.single('avatar'), pc.getPDetails);
pRouter.get('/get-all-details',upload.single('avatar'), pc.getAllDetails);
pRouter.put('/update-profile',upload.single('avatar'), pc.updateProfile);

export default pRouter;