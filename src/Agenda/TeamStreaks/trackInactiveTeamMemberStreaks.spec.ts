/* eslint-disable @typescript-eslint/no-explicit-any */
import { trackInactiveTeamMemberStreaks } from './trackInactiveTeamMemberStreaks';
import streakoid from '../../streakoid';

import { StreakTrackingEventTypes, StreakTypes } from '@streakoid/streakoid-sdk/lib';

describe('trackInactiveGroupMemberStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('that inactive groupMember streak activity gets updated and a groupMember streak tracking event is created', async () => {
        expect.assertions(1);
        streakoid.groupMemberStreaks.update = jest.fn().mockResolvedValue({ data: {} });
        streakoid.streakTrackingEvents.create = jest.fn().mockResolvedValue(true);
        const _id = '1';
        const currentStreak = {
            startDate: '24/02/95',
            numberOfDaysInARow: 1,
        };
        const userId = 'userId';
        const inactiveGroupMemberStreak = {
            _id,
            currentStreak,
            startDate: new Date(),
            completedToday: true,
            active: false,
            activity: [],
            pastStreaks: [],
            streakName: 'Daily Danish',
            streakDescription: 'Each day I must do Danish',
            userId,
            timezone: 'Europe/London',
            createdAt: new Date(),
            updatedAt: new Date(),
        } as any;
        const inactiveGroupMemberStreaks = [inactiveGroupMemberStreak];
        await trackInactiveTeamMemberStreaks(inactiveGroupMemberStreaks as any);

        expect(streakoid.streakTrackingEvents.create).toBeCalledWith({
            type: StreakTrackingEventTypes.inactiveStreak,
            streakId: _id,
            userId,
            streakType: StreakTypes.teamMember,
        });
    });
});
