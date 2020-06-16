import { Router } from 'express';
import { createProfilePictureMiddlewares } from '../../../RouteMiddlewares/ProfilePicture/createProfilePictureMiddlewares';
import { authenticationMiddlewares } from '../../../../src/SharedMiddleware/authenticationMiddlewares';
import multer from 'multer';

const profilePictureRouter = Router();

profilePictureRouter.use(...authenticationMiddlewares);

const upload = multer();

profilePictureRouter.post(`/`, upload.single('image'), ...createProfilePictureMiddlewares);

export { profilePictureRouter };
