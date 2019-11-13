import { Router } from 'express';
import { getCurrentUserMiddlewares } from '../../../../src/RouteMiddlewares/User/getCurrentUser';
import { patchCurrentUserMiddlewares } from '../../../../src/RouteMiddlewares/User/patchCurrentUserMiddlewares';
import { registerUserMiddlewares } from '../../../../src/RouteMiddlewares/User/registerUserMiddlewares';

const userRouter = Router();

userRouter.get('/', ...getCurrentUserMiddlewares);

userRouter.post(`/`, ...registerUserMiddlewares);

userRouter.patch('/', ...patchCurrentUserMiddlewares);

export { userRouter };
