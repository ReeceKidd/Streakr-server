import { resetIncompleteSoloStreaks } from '../../../src/Agenda/SoloStreaks/resetIncompleteSoloStreaks';
import StreakStatus from '@streakoid/streakoid-sdk/lib/StreakStatus';
import { StreakTrackingEventTypes, StreakTypes, ActivityFeedItemTypes } from '@streakoid/streakoid-sdk/lib';
import { StreakoidFactory } from '@streakoid/streakoid-sdk/lib/streakoid';

import { isTestEnvironment } from '../../../tests/setup/isTestEnvironment';
import { setupDatabase } from '../../setup/setupDatabase';
import { getPayingUser } from '../../setup/getPayingUser';
import { streakoidTest } from '../../../tests/setup/streakoidTest';
import { tearDownDatabase } from '../../setup/tearDownDatabase';

jest.setTimeout(120000);

describe('resetIncompleteSoloStreaks', () => {
    let streakoid: StreakoidFactory;
    let userId: string;
    const streakName = 'Daily Spanish';

    beforeAll(async () => {
        if (isTestEnvironment()) {
            await setupDatabase();
            const user = await getPayingUser();
            userId = user._id;
            streakoid = await streakoidTest();
        }
    });

    afterAll(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase();
        }
    });

    test('adds current streak to past streak,  resets the current streak and creats a lost streak tracking event.', async () => {
        expect.assertions(29);

        const soloStreak = await streakoid.soloStreaks.create({ userId, streakName });

        const soloStreakId = soloStreak._id;

        const incompleteSoloStreaks = await streakoid.soloStreaks.getAll({
            userId,
            completedToday: false,
        });

        const endDate = new Date();
        await resetIncompleteSoloStreaks(incompleteSoloStreaks, endDate.toString());

        const updatedSoloStreak = await streakoid.soloStreaks.getOne(soloStreakId);

        expect(updatedSoloStreak.streakName).toEqual(streakName);
        expect(updatedSoloStreak.status).toEqual(StreakStatus.live);
        expect(updatedSoloStreak.userId).toEqual(expect.any(String));
        expect(updatedSoloStreak.completedToday).toEqual(false);
        expect(updatedSoloStreak.active).toEqual(false);
        expect(updatedSoloStreak.pastStreaks.length).toEqual(1);
        const pastStreak = updatedSoloStreak.pastStreaks[0];
        expect(pastStreak.endDate).toEqual(expect.any(String));
        expect(pastStreak.numberOfDaysInARow).toEqual(0);
        expect(pastStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(pastStreak).sort()).toEqual(['endDate', 'numberOfDaysInARow', 'startDate'].sort());
        expect(updatedSoloStreak.timezone).toEqual(expect.any(String));
        const currentStreak = updatedSoloStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(0);
        expect(currentStreak.startDate).toEqual(null);
        expect(Object.keys(currentStreak)).toEqual(['startDate', 'numberOfDaysInARow']);
        expect(updatedSoloStreak._id).toEqual(expect.any(String));
        expect(updatedSoloStreak.createdAt).toEqual(expect.any(String));
        expect(updatedSoloStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedSoloStreak).sort()).toEqual(
            [
                '_id',
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'streakName',
                'streakDescription',
                'userId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
        const streakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
            userId,
        });
        const streakTrackingEvent = streakTrackingEvents[0];

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.lostStreak);
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent.streakId).toBeDefined();
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.solo);
        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const lostSoloStreakActivityFeedItems = await streakoid.activityFeedItems.getAll({
            activityFeedItemType: ActivityFeedItemTypes.lostSoloStreak,
        });
        const lostSoloStreakActivityFeedItem = lostSoloStreakActivityFeedItems.activityFeedItems[0];
        expect(lostSoloStreakActivityFeedItem.activityFeedItemType).toEqual(ActivityFeedItemTypes.lostSoloStreak);
        expect(lostSoloStreakActivityFeedItem.userId).toEqual(String(userId));
        expect(Object.keys(lostSoloStreakActivityFeedItem).sort()).toEqual(
            [
                '_id',
                'activityFeedItemType',
                'soloStreakId',
                'soloStreakName',
                'userId',
                'username',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });
});
