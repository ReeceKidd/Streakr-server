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
import { streakRecommendationsRouter } from './streakRecommendationsRouter';
import { timezoneMiddlewares } from '../../../SharedMiddleware/timezoneMiddlewares';
import { incompleteSoloStreakTasksRouter } from './incompleteSoloStreakTaskRouter';
import { incompleteTeamMemberStreakTasksRouter } from './incompleteTeamMemberStreakTaskRouter';
import { incompleteTeamStreaksRouter } from './incompleteTeamStreaksRouter';
import { dailyJobsRouter } from './dailyJobsRouter';
import { completeTeamStreaksRouter } from './completeTeamStreaksRouter';
import { emailRouter } from './emailRouter';
import { profilePictureRouter } from './profilePicturesRouter';
import { challengesRouter } from './challengesRouter';
import { activityFeedItemsRouter } from './activityFeedItemsRouter';

//import { hasUserPaidMembershipMiddleware } from '../../../../src/SharedMiddleware/hasUserPaidMembershipMiddleware';
import { userRouter } from './userRouter';
import { registerUserMiddlewares } from '../../../../src/RouteMiddlewares/User/registerUserMiddlewares';
import { challengeStreaksRouter } from './challengeStreakRouter';
import { completeChallengeStreakTasksRouter } from './completeChallengeStreakTaskRouter';
import { incompleteChallengeStreakTasksRouter } from './incompleteChallengeStreakTaskRouter';
import { notesRouter } from './notesRouter';
import { databaseStatsRouter } from './databaseStatsRouter';
import { achievementsRouter } from './achievementRouter';

const v1Router = Router();

v1Router.use(...timezoneMiddlewares);

//Registration API gateway
v1Router.post(`/${RouterCategories.users}`, ...registerUserMiddlewares);

// Unauthenticated routes
v1Router.use(`/${RouterCategories.emails}`, emailRouter);
v1Router.use(`/${RouterCategories.dailyJobs}`, dailyJobsRouter);
v1Router.use(`/${RouterCategories.streakTrackingEvents}`, streakTrackingEventRouter);
v1Router.use(`/${RouterCategories.users}`, usersRouter);
v1Router.use(`/${RouterCategories.activityFeedItems}`, activityFeedItemsRouter);
v1Router.use(`/${RouterCategories.streakRecommendations}`, streakRecommendationsRouter);

// Routes containing authentication
v1Router.use(`/${RouterCategories.achievements}`, achievementsRouter);
v1Router.use(`/${RouterCategories.teamStreaks}`, teamStreaksRouter);
v1Router.use(`/${RouterCategories.stripe}`, stripeRouter);
v1Router.use(`/${RouterCategories.user}`, userRouter);
v1Router.use(`/${RouterCategories.soloStreaks}`, soloStreaksRouter);
v1Router.use(`/${RouterCategories.teamMemberStreaks}`, teamMemberStreaksRouter);
v1Router.use(`/${RouterCategories.completeSoloStreakTasks}`, completeSoloStreakTasksRouter);
v1Router.use(`/${RouterCategories.incompleteSoloStreakTasks}`, incompleteSoloStreakTasksRouter);
v1Router.use(`/${RouterCategories.completeTeamStreaks}`, completeTeamStreaksRouter);
v1Router.use(`/${RouterCategories.incompleteTeamStreaks}`, incompleteTeamStreaksRouter);
v1Router.use(`/${RouterCategories.completeTeamMemberStreakTasks}`, completeTeamMemberStreakTasksRouter);
v1Router.use(`/${RouterCategories.incompleteTeamMemberStreakTasks}`, incompleteTeamMemberStreakTasksRouter);
v1Router.use(`/${RouterCategories.completeChallengeStreakTasks}`, completeChallengeStreakTasksRouter);
v1Router.use(`/${RouterCategories.incompleteChallengeStreakTasks}`, incompleteChallengeStreakTasksRouter);
v1Router.use(`/${RouterCategories.incompleteTeamMemberStreakTasks}`, incompleteTeamMemberStreakTasksRouter);
v1Router.use(`/${RouterCategories.profileImages}`, profilePictureRouter);
v1Router.use(`/${RouterCategories.challenges}`, challengesRouter);
v1Router.use(`/${RouterCategories.challengeStreaks}`, challengeStreaksRouter);
v1Router.use(`/${RouterCategories.notes}`, notesRouter);
v1Router.use(`/${RouterCategories.databaseStats}`, databaseStatsRouter);

export default v1Router;
