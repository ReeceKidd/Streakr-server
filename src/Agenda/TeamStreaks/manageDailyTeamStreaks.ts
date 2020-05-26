import moment from 'moment-timezone';

import { resetIncompleteTeamMemberStreaks } from './resetIncompleteTeamMemberStreaks';
import { trackInactiveTeamMemberStreaks } from './trackInactiveTeamMemberStreaks';
import { trackMaintainedTeamMemberStreaks } from './trackMaintainedTeamMemberStreaks';
import { trackInactiveTeamStreaks } from './trackInactiveTeamStreaks';
import { resetIncompleteTeamStreaks } from './resetIncompleteTeamStreaks';
import { trackMaintainedTeamStreaks } from './trackMaintainedTeamStreaks';
import { teamMemberStreakModel } from '../../../src/Models/TeamMemberStreak';
import { DailyJob } from '@streakoid/streakoid-models/lib/Models/DailyJob';
import { TeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/TeamMemberStreak';
import AgendaJobNames from '@streakoid/streakoid-models/lib/Types/AgendaJobNames';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createDailyJob } from '../../helpers/createDailyJob';
import { teamStreakModel } from '../../Models/TeamStreak';

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
        teamStreakModel.find({
            completedToday: false,
            active: true,
            timezone: timezone,
        }),
        teamStreakModel.find({
            completedToday: true,
            active: true,
            timezone,
        }),
        teamStreakModel.find({
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

    return createDailyJob({
        agendaJobId: String(agendaJobId),
        jobName: AgendaJobNames.teamStreakDailyTracker,
        timezone,
        localisedJobCompleteTime,
        streakType: StreakTypes.team,
    });
};
