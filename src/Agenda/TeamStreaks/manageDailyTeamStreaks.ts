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

    const [incompleteTeamMemberStreaks, maintainedTeamMemberStreaks, inactiveTeamMemberStreaks] = await Promise.all([
        streakoid.teamMemberStreaks.getAll({
            completedToday: false,
            active: true,
            timezone: timezone,
        }),
        streakoid.teamMemberStreaks.getAll({
            completedToday: true,
            active: true,
            timezone,
        }),
        streakoid.teamMemberStreaks.getAll({
            completedToday: false,
            active: false,
            timezone,
        }),
    ]);

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

    console.log('Number of maintained team streaks');
    console.log(trackMaintainedTeamStreaks.length);
    console.log(`Number of incomplete: ${incompleteTeamStreaks.length}`);
    console.log(`Number of inactive team streaks: ${inactiveTeamStreaks.length}`);

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
