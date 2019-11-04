import moment from 'moment-timezone';
import mongoose from 'mongoose';
import { DailyJob, AgendaJobNames, StreakTypes, TeamMemberStreak } from '@streakoid/streakoid-sdk/lib';

import streakoid from '../../streakoid';
import { resetIncompleteTeamMemberStreaks } from './resetIncompleteTeamMemberStreaks';
import { trackInactiveTeamMemberStreaks } from './trackInactiveTeamMemberStreaks';
import { trackMaintainedTeamMemberStreaks } from './trackMaintainedTeamMemberStreaks';
import { trackInactiveTeamStreaks } from './trackInactiveTeamStreaks';
import { resetIncompleteTeamStreaks } from './resetIncompleteTeamStreaks';
import { trackMaintainedTeamStreaks } from './trackMaintainedTeamStreaks';
import { getServiceConfig } from '../../../src/getServiceConfig';
import { teamMemberStreakModel } from '../../../src/Models/TeamMemberStreak';

const { DATABASE_URI } = getServiceConfig();

export const manageDailyTeamStreaks = async ({
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

    mongoose
        .connect(DATABASE_URI, { useNewUrlParser: true, useFindAndModify: false })
        .catch(err => console.log(err.message));

    const incompleteTeamMemberStreaks: TeamMemberStreak[] = await teamMemberStreakModel.find({
        completedToday: false,
        active: true,
        timezone: timezone,
    });

    const maintainedTeamMemberStreaks: TeamMemberStreak[] = await teamMemberStreakModel.find({
        completedToday: true,
        active: true,
        timezone: timezone,
    });

    const inactiveTeamMemberStreaks: TeamMemberStreak[] = await teamMemberStreakModel.find({
        completedToday: false,
        active: false,
        timezone,
    });

    await resetIncompleteTeamMemberStreaks(incompleteTeamMemberStreaks, currentLocalTime);
    await trackMaintainedTeamMemberStreaks(maintainedTeamMemberStreaks);
    await trackInactiveTeamMemberStreaks(inactiveTeamMemberStreaks);

    const [incompleteTeamStreaks, maintainedTeamStreaks, inactiveTeamStreaks] = await Promise.all([
        streakoid.teamStreaks.getAll({
            completedToday: false,
            active: true,
            timezone: timezone,
        }),
        streakoid.teamStreaks.getAll({
            completedToday: true,
            active: true,
            timezone,
        }),
        streakoid.teamStreaks.getAll({
            completedToday: false,
            active: false,
            timezone,
        }),
    ]);

    await resetIncompleteTeamStreaks(incompleteTeamStreaks, currentLocalTime);
    await trackMaintainedTeamStreaks(maintainedTeamStreaks);
    await trackInactiveTeamStreaks(inactiveTeamStreaks);

    const localisedJobCompleteTime = moment
        .tz(timezone)
        .toDate()
        .toString();

    return streakoid.dailyJobs.create({
        agendaJobId: String(agendaJobId),
        jobName: AgendaJobNames.teamStreakDailyTracker,
        timezone,
        localisedJobCompleteTime,
        streakType: StreakTypes.team,
    });
};
