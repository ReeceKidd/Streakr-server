import moment from 'moment-timezone';

// import { trackMaintainedSoloStreaks } from '../SoloStreaks/trackMaintainedSoloStreaks';
// import { trackInactiveSoloStreaks } from '../SoloStreaks/trackInactiveSoloStreaks';
// import { resetIncompleteSoloStreaks } from '../SoloStreaks/resetIncompleteSoloStreaks';

import streakoid from '../../streakoid';
import { resetIncompleteTeamMemberStreaks } from './resetIncompleteTeamMemberStreaks';
import { trackInactiveTeamMemberStreaks } from './trackInactiveTeamMemberStreaks';
import { trackMaintainedGroupMemberStreaks } from './trackMaintainedTeamMemberStreaks';

export const manageDailyTeamMemberStreaks = async (timezone: string): void => {
    const currentLocalTime = moment
        .tz(timezone)
        .toDate()
        .toString();

    // Can't do these in a promise all because inactive has to reset the team streak

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
    await trackMaintainedGroupMemberStreaks(maintainedGroupMemberStreaks);
    await trackInactiveTeamMemberStreaks(inactiveGroupMemberStreaks);

    await Promise.all([]);

    // And then it's basically the same logic as the solo streaks. To reset the team streak.

    // Check for each team streak has each member completed the task they had to.
    // Should set a failed property inside of resetIncompleteTeam member that this function can use.

    // Add function here that ups the number of days for each team streak
};
