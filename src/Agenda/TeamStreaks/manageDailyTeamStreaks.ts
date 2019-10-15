import moment from 'moment-timezone';

// import { trackMaintainedSoloStreaks } from '../SoloStreaks/trackMaintainedSoloStreaks';
// import { trackInactiveSoloStreaks } from '../SoloStreaks/trackInactiveSoloStreaks';
// import { resetIncompleteSoloStreaks } from '../SoloStreaks/resetIncompleteSoloStreaks';

import streakoid from '../../streakoid';
import { resetIncompleteTeamMemberStreaks } from './resetIncompleteTeamMemberStreaks';
import { trackInactiveTeamMemberStreaks } from './trackInactiveTeamMemberStreaks';
import { trackMaintainedTeamMemberStreaks } from './trackMaintainedTeamMemberStreaks';
import { trackInactiveTeamStreaks } from './trackInactiveTeamStreaks';
import { resetIncompleteTeamStreaks } from './resetIncompleteTeamStreaks';
import { trackMaintainedTeamStreaks } from './trackMaintainedTeamStreaks';
import { DailyJob, AgendaJobNames, StreakTypes } from '@streakoid/streakoid-sdk/lib';

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

    const [incompleteGroupMemberStreaks, maintainedGroupMemberStreaks, inactiveGroupMemberStreaks] = await Promise.all([
        streakoid.groupMemberStreaks.getAll({
            completedToday: false,
            active: true,
            timezone: timezone,
        }),
        streakoid.groupMemberStreaks.getAll({
            completedToday: true,
            active: true,
            timezone,
        }),
        streakoid.groupMemberStreaks.getAll({
            completedToday: false,
            active: false,
            timezone,
        }),
    ]);

    await resetIncompleteTeamMemberStreaks(incompleteGroupMemberStreaks, currentLocalTime);
    await trackMaintainedTeamMemberStreaks(maintainedGroupMemberStreaks);
    await trackInactiveTeamMemberStreaks(inactiveGroupMemberStreaks);

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
