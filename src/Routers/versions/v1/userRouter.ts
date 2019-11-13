import { Router } from 'express';
import { getCurrentUserMiddlewares } from '../../../../src/RouteMiddlewares/User/getCurrentUser';
import { patchCurrentUserMiddlewares } from '../../../../src/RouteMiddlewares/User/patchCurrentUserMiddlewares';

const userRouter = Router();

userRouter.get('/', ...getCurrentUserMiddlewares);

userRouter.patch('/', ...patchCurrentUserMiddlewares);

export { userRouter };
