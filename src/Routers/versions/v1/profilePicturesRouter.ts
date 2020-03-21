import { Router } from 'express';
import { createProfilePictureMiddlewares } from '../../../RouteMiddlewares/ProfilePicture/createProfilePictureMiddlewares';
import { authenticationMiddlewares } from '../../../../src/SharedMiddleware/authenticationMiddlewares';

const profilePictureRouter = Router();

profilePictureRouter.use(...authenticationMiddlewares);

profilePictureRouter.post(`/`, ...createProfilePictureMiddlewares);

export { profilePictureRouter };
