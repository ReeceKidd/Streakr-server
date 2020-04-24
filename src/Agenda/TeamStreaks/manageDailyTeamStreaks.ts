import moment from 'moment-timezone';
import { DailyJob, AgendaJobNames, StreakTypes, TeamMemberStreak } from '@streakoid/streakoid-models/lib';

import streakoid from '../../streakoid';
import { resetIncompleteTeamMemberStreaks } from './resetIncompleteTeamMemberStreaks';
import { trackInactiveTeamMemberStreaks } from './trackInactiveTeamMemberStreaks';
import { trackMaintainedTeamMemberStreaks } from './trackMaintainedTeamMemberStreaks';
import { trackInactiveTeamStreaks } from './trackInactiveTeamStreaks';
import { resetIncompleteTeamStreaks } from './resetIncompleteTeamStreaks';
import { trackMaintainedTeamStreaks } from './trackMaintainedTeamStreaks';
import { teamMemberStreakModel } from '../../../src/Models/TeamMemberStreak';

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
