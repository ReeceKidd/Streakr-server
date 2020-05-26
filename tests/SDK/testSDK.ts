/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { challenges } from './challenges';
import { challengeStreaks } from './challengeStreaks';
import { streakTrackingEvents } from './streakTrackingEvents';
import { users } from './users';
import { activityFeedItems } from './activityFeedItems';
import { completeChallengeStreakTasks } from './completeChallengeStreakTasks';
import { dailyJobs } from './dailyJobs';
import { soloStreaks } from './soloStreaks';
import { completeSoloStreakTasks } from './completeSoloStreakTasks';
import { teamStreaks } from './teamStreaks';
import { teamMemberStreaks } from './teamMemberStreaks';
import { completeTeamMemberStreakTasks } from './completeTeamMemberStreakTasks';
import { completeTeamStreaks } from './completeTeamStreaks';
import { apiTester } from './apiTester';

export interface TestSDKFactory {
    completeSoloStreakTasks: ReturnType<typeof completeSoloStreakTasks>;
    completeTeamMemberStreakTasks: ReturnType<typeof completeTeamMemberStreakTasks>;
    completeTeamStreaks: ReturnType<typeof completeTeamStreaks>;
    completeChallengeStreakTasks: ReturnType<typeof completeChallengeStreakTasks>;
    soloStreaks: ReturnType<typeof soloStreaks>;
    users: ReturnType<typeof users>;
    teamStreaks: ReturnType<typeof teamStreaks>;
    streakTrackingEvents: ReturnType<typeof streakTrackingEvents>;
    teamMemberStreaks: ReturnType<typeof teamMemberStreaks>;
    dailyJobs: ReturnType<typeof dailyJobs>;
    challenges: ReturnType<typeof challenges>;
    challengeStreaks: ReturnType<typeof challengeStreaks>;
    activityFeedItems: ReturnType<typeof activityFeedItems>;
}

export const testSDK = ({ databaseURI }: { databaseURI: string }): TestSDKFactory => {
    const { getRequest, getRequestActivityFeed, postRequest, patchRequest, deleteRequest } = apiTester({ databaseURI });
    return {
        challenges: challenges({ getRequest, postRequest }),
        challengeStreaks: challengeStreaks({ getRequest, postRequest }),
        streakTrackingEvents: streakTrackingEvents({ getRequest, postRequest }),
        users: users({ getRequest, postRequest }),
        activityFeedItems: activityFeedItems({ getRequest: getRequestActivityFeed, postRequest }),
        dailyJobs: dailyJobs({ getRequest, postRequest }),
        completeChallengeStreakTasks: completeChallengeStreakTasks({ getRequest, postRequest }),
        soloStreaks: soloStreaks({ getRequest, postRequest }),
        completeSoloStreakTasks: completeSoloStreakTasks({ getRequest, postRequest }),
        teamStreaks: teamStreaks({ getRequest, postRequest, patchRequest, deleteRequest }),
        teamMemberStreaks: teamMemberStreaks({ getRequest, postRequest, patchRequest }),
        completeTeamMemberStreakTasks: completeTeamMemberStreakTasks({ getRequest, postRequest }),
        completeTeamStreaks: completeTeamStreaks({ getRequest }),
    };
};
