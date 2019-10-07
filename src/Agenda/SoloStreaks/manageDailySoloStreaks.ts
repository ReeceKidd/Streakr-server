import moment from 'moment-timezone';

import { trackMaintainedSoloStreaks } from './trackMaintainedSoloStreaks';
import { trackInactiveSoloStreaks } from './trackInactiveSoloStreaks';
import { resetIncompleteSoloStreaks } from './resetIncompleteSoloStreaks';
import streakoid from '../../streakoid';

export const manageDailySoloStreaks = async (timezone: string) => {
    const currentLocalTime = moment
        .tz(timezone)
        .toDate()
        .toString();

    const [maintainedSoloStreaks, inactiveSoloStreaks, incompleteSoloStreaks] = await Promise.all([
        streakoid.soloStreaks.getAll({
            completedToday: true,
            active: true,
            timezone,
        }),
        streakoid.soloStreaks.getAll({
            completedToday: false,
            active: false,
            timezone,
        }),
        streakoid.soloStreaks.getAll({
            completedToday: false,
            active: true,
            timezone: timezone,
        }),
    ]);

    return Promise.all([
        trackMaintainedSoloStreaks(maintainedSoloStreaks),
        trackInactiveSoloStreaks(inactiveSoloStreaks),
        resetIncompleteSoloStreaks(incompleteSoloStreaks, currentLocalTime),
    ]);
};
