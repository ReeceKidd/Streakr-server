import { Router } from 'express';
import { getCurrentUserMiddlewares } from '../../../../src/RouteMiddlewares/User/getCurrentUser';
import { patchCurrentUserMiddlewares } from '../../../../src/RouteMiddlewares/User/patchCurrentUserMiddlewares';
import { authenticationMiddlewares } from '../../../../src/SharedMiddleware/authenticationMiddlewares';
import { patchCurrentUserPushNotificationsMiddlewares } from '../../../../src/RouteMiddlewares/User/PushNotifications/patchCurrentUserPushNotifications';
import { getCurrentUserSoloStreaksMiddlewares } from '../../../RouteMiddlewares/User/SoloStreaks/getCurrentUserSoloStreaksMiddlewares';
import { getCurrentUserChallengeStreaksMiddleware } from '../../../RouteMiddlewares/User/ChallengeStreaks/getCurrentUserChallengeStreaksMiddlewares';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { getCurrentUserTeamMemberStreaksMiddlewares } from '../../../RouteMiddlewares/User/TeamMemberStreaks/getCurrentUserTeamMemberStreaksMiddlewares';
import { getCurrentUserTeamStreaksMiddlewares } from '../../../RouteMiddlewares/User/TeamStreaks/getCurrentUserTeamStreaksMiddlewares';

const userRouter = Router();

userRouter.use(...authenticationMiddlewares);

userRouter.get('/', ...getCurrentUserMiddlewares);

userRouter.patch('/', ...patchCurrentUserMiddlewares);

userRouter.patch('/push-notifications', ...patchCurrentUserPushNotificationsMiddlewares);

userRouter.get(`/${RouterCategories.soloStreaks}`, ...getCurrentUserSoloStreaksMiddlewares);

userRouter.get(`/${RouterCategories.challengeStreaks}`, ...getCurrentUserChallengeStreaksMiddleware);

userRouter.get(`/${RouterCategories.teamMemberStreaks}`, ...getCurrentUserTeamMemberStreaksMiddlewares);

userRouter.get(`/${RouterCategories.teamStreaks}`, ...getCurrentUserTeamStreaksMiddlewares);

export { userRouter };
