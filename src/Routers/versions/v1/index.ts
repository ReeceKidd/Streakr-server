import { Router } from 'express';
import { RouterCategories } from '@streakoid/streakoid-sdk/lib';

import { soloStreaksRouter } from './soloStreaksRouter';
import { usersRouter } from './usersRouter';
import { stripeRouter } from './stripeRouter';
import { completeSoloStreakTasksRouter } from './completeSoloStreakTasksRouter';
import { completeTeamMemberStreakTasksRouter } from './completeTeamMemberStreakTaskRouter';
import { teamStreaksRouter } from './teamStreakRouter';
import { streakTrackingEventRouter } from './streakTrackingEventRouter';
import { teamMemberStreaksRouter } from './teamMemberStreaksRouter';
import { friendRequestsRouter } from './friendRequestRouter';
import { timezoneMiddlewares } from '../../../SharedMiddleware/timezoneMiddlewares';
import { authenticationMiddlewares } from '../../../SharedMiddleware/authenticationMiddlewares';
import { incompleteSoloStreakTasksRouter } from './incompleteSoloStreakTaskRouter';
import { incompleteTeamMemberStreakTasksRouter } from './incompleteTeamMemberStreakTaskRouter';
import { incompleteTeamStreaksRouter } from './incompleteTeamStreaksRouter';
import { dailyJobsRouter } from './dailyJobsRouter';
import { completeTeamStreaksRouter } from './completeTeamStreaksRouter';
import { registerUserMiddlewares } from '../../../RouteMiddlewares/User/registerUserMiddlewares';
import { emailRouter } from './emailRouter';
import { profilePictureRouter } from './profilePicturesRouter';
import { hasUserPaidMembershipMiddleware } from '../../../../src/SharedMiddleware/hasUserPaidMembershipMiddleware';
import { registerDeviceForNotificationsRouter } from './registerDeviceForNotificationsRouter';
import { userRouter } from './userRouter';

const v1Router = Router();

v1Router.use(...timezoneMiddlewares);

// Unauthenticated routes
v1Router.post(`/${RouterCategories.users}`, ...registerUserMiddlewares);
v1Router.use(`/${RouterCategories.emails}`, emailRouter);
v1Router.use(`/${RouterCategories.dailyJobs}`, dailyJobsRouter);
v1Router.use(`/${RouterCategories.streakTrackingEvents}`, streakTrackingEventRouter);
v1Router.use(`/${RouterCategories.users}`, usersRouter);
v1Router.use(`/${RouterCategories.registerDeviceForNotifications}`, registerDeviceForNotificationsRouter);

// Partially authenticated routes.
v1Router.use(`/${RouterCategories.teamStreaks}`, teamStreaksRouter);

// Authenticated User Routes
v1Router.use(...authenticationMiddlewares);
v1Router.use(`/${RouterCategories.user}`, userRouter);
v1Router.use(`/${RouterCategories.stripe}`, stripeRouter);

// Paid Membership routes
v1Router.use(hasUserPaidMembershipMiddleware);
v1Router.use(`/${RouterCategories.soloStreaks}`, soloStreaksRouter);
v1Router.use(`/${RouterCategories.teamMemberStreaks}`, teamMemberStreaksRouter);
v1Router.use(`/${RouterCategories.completeSoloStreakTasks}`, completeSoloStreakTasksRouter);
v1Router.use(`/${RouterCategories.completeTeamStreaks}`, completeTeamStreaksRouter);
v1Router.use(`/${RouterCategories.completeTeamMemberStreakTasks}`, completeTeamMemberStreakTasksRouter);
v1Router.use(`/${RouterCategories.incompleteSoloStreakTasks}`, incompleteSoloStreakTasksRouter);
v1Router.use(`/${RouterCategories.incompleteTeamMemberStreakTasks}`, incompleteTeamMemberStreakTasksRouter);
v1Router.use(`/${RouterCategories.incompleteTeamStreaks}`, incompleteTeamStreaksRouter);
v1Router.use(`/${RouterCategories.friendRequests}`, friendRequestsRouter);
v1Router.use(`/${RouterCategories.profileImages}`, profilePictureRouter);

export default v1Router;
