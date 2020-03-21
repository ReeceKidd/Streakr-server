import { Router } from 'express';
import { getCurrentUserMiddlewares } from '../../../../src/RouteMiddlewares/User/getCurrentUser';
import { patchCurrentUserMiddlewares } from '../../../../src/RouteMiddlewares/User/patchCurrentUserMiddlewares';
import { authenticationMiddlewares } from '../../../../src/SharedMiddleware/authenticationMiddlewares';

const userRouter = Router();

userRouter.use(...authenticationMiddlewares);

userRouter.get('/', ...getCurrentUserMiddlewares);

userRouter.patch('/', ...patchCurrentUserMiddlewares);

export { userRouter };
