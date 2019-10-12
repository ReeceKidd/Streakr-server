import moment from 'moment-timezone';

// import { trackMaintainedSoloStreaks } from '../SoloStreaks/trackMaintainedSoloStreaks';
// import { trackInactiveSoloStreaks } from '../SoloStreaks/trackInactiveSoloStreaks';
// import { resetIncompleteSoloStreaks } from '../SoloStreaks/resetIncompleteSoloStreaks';

import streakoid from '../../streakoid';

export const manageDailyTeamMemberStreaks = async (timezone: string) => {
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

    return Promise.all([
        // trackMaintainedGroupMemberStreaks(maintainedGroupMemberStreaks, currentLocalTime.toString()),
        // trackInactiveGroupMemberStreaks(inactiveGroupMemberStreaks, currentLocalTime),
        // resetIncompleteGroupMemberStreaks(incompleteGroupMemberStreaks, currentLocalTime, timezone),
    ]);
};
