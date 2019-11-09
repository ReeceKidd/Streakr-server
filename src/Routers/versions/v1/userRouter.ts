import { Router } from 'express';
import { getCurrentUserMiddlewares } from '../../../../src/RouteMiddlewares/User/getCurrentUser';

const userRouter = Router();

userRouter.get('/', ...getCurrentUserMiddlewares);

export { userRouter };
