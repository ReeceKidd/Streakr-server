/* eslint-disable @typescript-eslint/no-explicit-any */
import { resetIncompleteTeamMemberStreaks } from './resetIncompleteTeamMemberStreaks';
import streakoid from '../../streakoid';
import { teamMemberStreakModel } from '../../../src/Models/TeamMemberStreak';
import { teamStreakModel } from '../../../src/Models/TeamStreak';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

describe('resetIncompleteSoloStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('that incomplete teamMemberStreaks default current streak is reset, past streak is pushed to past streaks, and the teamStreak the teamMemberStreak belongs to completed today gets set to false and lost streak activity is recorded', async () => {
        expect.assertions(6);
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        const username = 'username';
        const teamStreakName = 'Reading';
        streakoid.streakTrackingEvents.create = jest.fn().mockResolvedValue(true);
        const userProfileImage = 'google.com/image';
        streakoid.users.getOne = jest
            .fn()
            .mockResolvedValue({ username, profileImages: { originalImageUrl: userProfileImage } });
        const teamStreakId = 'teamStreakId';
        streakoid.teamStreaks.getOne = jest.fn().mockResolvedValue({ _id: teamStreakId, streakName: teamStreakName });
        streakoid.activityFeedItems.create = jest.fn().mockResolvedValue(true);
        const endDate = new Date().toString();
        const currentStreak = {
            startDate: undefined,
            numberOfDaysInARow: 0,
        };
        const userId = '5c35116059f7ba19e4e248a9';
        const _id = '_id';

        const incompleteTeamMemberStreaks = [
            {
                _id,
                teamStreakId,
                currentStreak,
                startDate: new Date().toString(),
                completedToday: false,
                pastStreaks: [],
                streakName: 'Daily Danish',
                streakDescription: 'Each day I must do Danish',
                userId,
                timezone: 'Europe/London',
                createdAt: new Date().toString(),
                updatedAt: new Date().toString(),
            } as any,
        ];
        const pastStreaks = [{ numberOfDaysInARow: 0, endDate, startDate: endDate }];
        await resetIncompleteTeamMemberStreaks(incompleteTeamMemberStreaks as any, endDate);

        expect(teamMemberStreakModel.findByIdAndUpdate).toBeCalledWith(_id, {
            $set: {
                currentStreak: { startDate: '', numberOfDaysInARow: 0 },
                pastStreaks,
                active: false,
            },
        });

        expect(teamStreakModel.findByIdAndUpdate).toBeCalledWith(teamStreakId, {
            $set: {
                completedToday: false,
            },
        });

        expect(streakoid.users.getOne).toBeCalled();
        expect(streakoid.teamStreaks.getOne).toBeCalled();

        expect(streakoid.activityFeedItems.create).toBeCalledWith({
            activityFeedItemType: ActivityFeedItemTypes.lostTeamStreak,
            userId,
            username,
            userProfileImage,
            teamStreakId,
            teamStreakName,
            numberOfDaysLost: currentStreak.numberOfDaysInARow,
        });

        expect(streakoid.streakTrackingEvents.create).toBeCalledWith({
            type: StreakTrackingEventTypes.lostStreak,
            streakId: _id,
            userId,
            streakType: StreakTypes.teamMember,
        });
    });
});
