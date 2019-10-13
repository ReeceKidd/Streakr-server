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

    const [maintainedGroupMemberStreaks, inactiveGroupMemberStreaks, incompleteGroupMemberStreaks] = await Promise.all([
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
        streakoid.groupMemberStreaks.getAll({
            completedToday: false,
            active: true,
            timezone: timezone,
        }),
    ]);

    await resetIncompleteTeamMemberStreaks(incompleteGroupMemberStreaks, currentLocalTime);
    await trackMaintainedTeamMemberStreaks(maintainedGroupMemberStreaks);
    await trackInactiveTeamMemberStreaks(inactiveGroupMemberStreaks);

    const [maintainedTeamStreaks, inactiveTeamStreaks, incompleteTeamStreaks] = await Promise.all([
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
        streakoid.teamStreaks.getAll({
            completedToday: false,
            active: true,
            timezone: timezone,
        }),
    ]);

    await Promise.all([
        trackMaintainedTeamStreaks(maintainedTeamStreaks),
        trackInactiveTeamStreaks(inactiveTeamStreaks),
        resetIncompleteTeamStreaks(incompleteTeamStreaks, currentLocalTime),
    ]);

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
