/* eslint-disable @typescript-eslint/no-explicit-any */
import { trackMaintainedTeamStreaks } from './trackMaintainedTeamStreaks';
import streakoid from '../../streakoid';
import { teamStreakModel } from '../../../src/Models/TeamStreak';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

describe('trackMaintainedTeamStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('creates a streak tracking event for each streak that is maintained', async () => {
        expect.assertions(2);
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        streakoid.streakTrackingEvents.create = jest.fn().mockResolvedValue(true);
        const _id = 1;
        const currentStreak = {
            startDate: '24/02/95',
            numberOfDaysInARow: 1,
        };
        const maintainedTeamStreaks = [
            {
                _id,
                currentStreak,
                startDate: new Date(),
                completedToday: true,
                activity: [],
                pastStreaks: [],
                streakName: 'Daily Danish',
                streakDescription: 'Each day I must do Danish',
                timezone: 'Europe/London',
                createdAt: new Date(),
                updatedAt: new Date(),
            } as any,
        ];
        await trackMaintainedTeamStreaks(maintainedTeamStreaks as any);
        expect(teamStreakModel.findByIdAndUpdate).toBeCalledWith(_id, {
            $set: {
                completedToday: false,
            },
        });
        expect(streakoid.streakTrackingEvents.create).toBeCalledWith({
            type: StreakTrackingEventTypes.maintainedStreak,
            streakId: _id,
            streakType: StreakTypes.team,
        });
    });
});
