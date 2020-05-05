import moment from 'moment-timezone';

import { trackMaintainedChallengeStreaks } from './trackMaintainedChallengeStreaks';
import { trackInactiveChallengeStreaks } from './trackInactiveChallengeStreaks';
import { resetIncompleteChallengeStreaks } from './resetIncompleteChallengeStreaks';
import streakoid from '../../streakoid';
import { challengeStreakModel } from '../../../src/Models/ChallengeStreak';
import { DailyJob } from '@streakoid/streakoid-models/lib/Models/DailyJob';
import { ChallengeStreak } from '@streakoid/streakoid-models/lib/Models/ChallengeStreak';
import AgendaJobNames from '@streakoid/streakoid-models/lib/Types/AgendaJobNames';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

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
