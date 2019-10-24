import { Router } from 'express';
import { createProfilePictureMiddlewares } from '../../../RouteMiddlewares/ProfilePicture/createProfilePictureMiddlewares';

const profilePictureRouter = Router();

profilePictureRouter.post(`/`, ...createProfilePictureMiddlewares);

export { profilePictureRouter };
