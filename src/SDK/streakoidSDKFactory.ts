import { GetRequest, PostRequest, PatchRequest, DeleteRequest } from './request';
import { emails } from './emails';
import { incompleteTeamStreaks } from './incompleteTeamStreaks';
import { completeChallengeStreakTasks } from './completeChallengeStreakTask';
import { incompleteChalllengeStreakTasks } from './incompleteChallengeStreakTask';
import { notes } from './notes';
import { activityFeedItems } from './activityFeedItems';
import { databaseStats } from './databaseStats';
import { achievements } from './achievements';
import { completeSoloStreakTasks } from './completeSoloStreakTasks';
import { incompleteSoloStreakTasks } from './incompleteSoloStreakTasks';
import { completeTeamMemberStreakTasks } from './completeTeamMemberStreakTasks';
import { incompleteTeamMemberStreakTasks } from './incompleteTeamMemberStreakTasks';
import { soloStreaks } from './soloStreaks';
import { stripe } from './stripe';
import { users } from './users';
import { user } from './user';
import { teamStreaks } from './teamStreaks';
import { streakTrackingEvents } from './streakTrackingEvents';
import { feedbacks } from './feedbacks';
import { dailyJobs } from './dailyJobs';
import { completeTeamStreaks } from './completeTeamStreaks';
import { teamMemberStreaks } from './teamMemberStreaks';
import { streakRecommendations } from './streakRecommendations';
import { challenges } from './challenges';
import { challengeStreaks } from './challengeStreaks';

export interface StreakoidSDK {
    completeSoloStreakTasks: ReturnType<typeof completeSoloStreakTasks>;
    incompleteSoloStreakTasks: ReturnType<typeof incompleteSoloStreakTasks>;
    completeTeamMemberStreakTasks: ReturnType<typeof completeTeamMemberStreakTasks>;
    incompleteTeamMemberStreakTasks: ReturnType<typeof incompleteTeamMemberStreakTasks>;
    completeTeamStreaks: ReturnType<typeof completeTeamStreaks>;
    incompleteTeamStreaks: ReturnType<typeof incompleteTeamStreaks>;
    completeChallengeStreakTasks: ReturnType<typeof completeChallengeStreakTasks>;
    incompleteChallengeStreakTasks: ReturnType<typeof incompleteChalllengeStreakTasks>;
    soloStreaks: ReturnType<typeof soloStreaks>;
    stripe: ReturnType<typeof stripe>;
    users: ReturnType<typeof users>;
    user: ReturnType<typeof user>;
    teamStreaks: ReturnType<typeof teamStreaks>;
    streakTrackingEvents: ReturnType<typeof streakTrackingEvents>;
    feedbacks: ReturnType<typeof feedbacks>;
    teamMemberStreaks: ReturnType<typeof teamMemberStreaks>;
    dailyJobs: ReturnType<typeof dailyJobs>;
    emails: ReturnType<typeof emails>;
    streakRecommendations: ReturnType<typeof streakRecommendations>;
    challenges: ReturnType<typeof challenges>;
    challengeStreaks: ReturnType<typeof challengeStreaks>;
    notes: ReturnType<typeof notes>;
    activityFeedItems: ReturnType<typeof activityFeedItems>;
    databaseStats: ReturnType<typeof databaseStats>;
    achievements: ReturnType<typeof achievements>;
}

export const streakoidSDKFactory = ({
    getRequest,
    getRequestActivityFeed,
    postRequest,
    patchRequest,
    deleteRequest,
}: {
    getRequest: GetRequest;
    getRequestActivityFeed: GetRequest;
    postRequest: PostRequest;
    patchRequest: PatchRequest;
    deleteRequest: DeleteRequest;
}): StreakoidSDK => {
    return {
        completeSoloStreakTasks: completeSoloStreakTasks({ getRequest, postRequest }),
        incompleteSoloStreakTasks: incompleteSoloStreakTasks({ getRequest, postRequest }),
        completeTeamMemberStreakTasks: completeTeamMemberStreakTasks({ getRequest, postRequest }),
        completeChallengeStreakTasks: completeChallengeStreakTasks({ getRequest, postRequest }),
        incompleteChallengeStreakTasks: incompleteChalllengeStreakTasks({ postRequest }),
        incompleteTeamMemberStreakTasks: incompleteTeamMemberStreakTasks({ getRequest, postRequest }),
        completeTeamStreaks: completeTeamStreaks({ getRequest }),
        incompleteTeamStreaks: incompleteTeamStreaks({ getRequest }),
        soloStreaks: soloStreaks({ getRequest, postRequest, patchRequest }),
        stripe: stripe({ postRequest }),
        users: users({ getRequest, postRequest, patchRequest }),
        user: user({ getRequest, patchRequest }),
        teamStreaks: teamStreaks({ getRequest, postRequest, patchRequest, deleteRequest }),
        streakTrackingEvents: streakTrackingEvents({ getRequest, postRequest }),
        feedbacks: feedbacks({ postRequest }),
        teamMemberStreaks: teamMemberStreaks({ getRequest, postRequest, patchRequest }),
        dailyJobs: dailyJobs({ getRequest, postRequest }),
        emails: emails({ postRequest }),
        streakRecommendations: streakRecommendations({ getRequest }),
        challenges: challenges({ getRequest, postRequest }),
        challengeStreaks: challengeStreaks({ getRequest, postRequest, patchRequest }),
        notes: notes({ getRequest, postRequest, deleteRequest }),
        activityFeedItems: activityFeedItems({ getRequest: getRequestActivityFeed, postRequest }),
        databaseStats: databaseStats({ getRequest }),
        achievements: achievements({ getRequest, postRequest }),
    };
};
