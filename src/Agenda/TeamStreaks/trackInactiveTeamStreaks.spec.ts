/* eslint-disable @typescript-eslint/no-explicit-any */
import { trackInactiveTeamStreaks } from './trackInactiveTeamStreaks';
import streakoid from '../../streakoid';

import { StreakTrackingEventTypes, StreakTypes } from '@streakoid/streakoid-models/lib';

describe('trackInactiveTeamStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('that inactive team streak activity gets updated and a team streak tracking event is created', async () => {
        expect.assertions(1);
        streakoid.teamStreaks.update = jest.fn().mockResolvedValue({ data: {} });
        streakoid.streakTrackingEvents.create = jest.fn().mockResolvedValue(true);
        const _id = '1';
        const currentStreak = {
            startDate: '24/02/95',
            numberOfDaysInARow: 1,
        };
        const inactiveTeamStreak = {
            _id,
            currentStreak,
            startDate: new Date(),
            completedToday: true,
            active: false,
            activity: [],
            pastStreaks: [],
            streakName: 'Daily Danish',
            streakDescription: 'Each day I must do Danish',
            timezone: 'Europe/London',
            createdAt: new Date(),
            updatedAt: new Date(),
        } as any;
        const inactiveTeamStreaks = [inactiveTeamStreak];
        await trackInactiveTeamStreaks(inactiveTeamStreaks as any);

        expect(streakoid.streakTrackingEvents.create).toBeCalledWith({
            type: StreakTrackingEventTypes.inactiveStreak,
            streakId: _id,
            streakType: StreakTypes.team,
        });
    });
});
