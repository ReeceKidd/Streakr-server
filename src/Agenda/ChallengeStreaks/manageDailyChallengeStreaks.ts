import moment from 'moment-timezone';
import { AgendaJobNames, StreakTypes, DailyJob, ChallengeStreak } from '@streakoid/streakoid-sdk/lib';

import { trackMaintainedChallengeStreaks } from './trackMaintainedChallengeStreaks';
import { trackInactiveChallengeStreaks } from './trackInactiveChallengeStreaks';
import { resetIncompleteChallengeStreaks } from './resetIncompleteChallengeStreaks';
import streakoid from '../../streakoid';
import { challengeStreakModel } from '../../../src/Models/ChallengeStreak';

export const manageDailyChallengeStreaks = async ({
    agendaJobId,
    timezone,
}: {
    agendaJobId: string;
    timezone: string;
}): Promise<DailyJob> => {
    const currentLocalTime = moment
        .tz(timezone)
        .toDate()
        .toString();

    const maintainedChallengeStreaks: ChallengeStreak[] = await challengeStreakModel.find({
        completedToday: true,
        active: true,
        timezone,
    });

    const inactiveChallengeStreaks: ChallengeStreak[] = await challengeStreakModel.find({
        completedToday: false,
        active: false,
        timezone,
    });

    const incompleteChallengeStreaks: ChallengeStreak[] = await challengeStreakModel.find({
        completedToday: false,
        active: true,
        timezone: timezone,
    });

    await Promise.all([
        trackMaintainedChallengeStreaks(maintainedChallengeStreaks),
        trackInactiveChallengeStreaks(inactiveChallengeStreaks),
        resetIncompleteChallengeStreaks(incompleteChallengeStreaks, currentLocalTime),
    ]);

    const localisedJobCompleteTime = moment
        .tz(timezone)
        .toDate()
        .toString();

    return streakoid.dailyJobs.create({
        agendaJobId: String(agendaJobId),
        jobName: AgendaJobNames.challengeStreakDailyTracker,
        timezone,
        localisedJobCompleteTime,
        streakType: StreakTypes.challenge,
    });
};
