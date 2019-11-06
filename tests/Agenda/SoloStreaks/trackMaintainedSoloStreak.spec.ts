import StreakStatus from '@streakoid/streakoid-sdk/lib/StreakStatus';
import { StreakTrackingEventTypes, StreakTypes } from '@streakoid/streakoid-sdk/lib';
import { StreakoidFactory } from '@streakoid/streakoid-sdk/lib/streakoid';

import { trackMaintainedSoloStreaks } from '.../../../src/Agenda/SoloStreaks/trackMaintainedSoloStreaks';
import { isTestEnvironment } from '../../../tests/setup/isTestEnvironment';
import { setupDatabase } from '../../setup/setupDatabase';
import { streakoidTest } from '../../../tests/setup/streakoidTest';
import { tearDownDatabase } from '../../../tests/setup/tearDownDatabase';
import { getPayingUser } from '../../setup/getPayingUser';

jest.setTimeout(120000);

describe('trackMaintainedSoloStreak', () => {
    let streakoid: StreakoidFactory;
    let userId: string;
    const streakName = 'Daily Spanish';
    const streakDescription = 'Everyday I must study Spanish';

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

    test('updates solo streak completedToday field and creates a streak maintained tracking event', async () => {
        expect.assertions(23);

        const soloStreak = await streakoid.soloStreaks.create({ userId, streakName, streakDescription });
        const soloStreakId = soloStreak._id;

        await streakoid.completeSoloStreakTasks.create({
            userId,
            soloStreakId,
        });

        const maintainedSoloStreaks = await streakoid.soloStreaks.getAll({
            completedToday: true,
        });

        await trackMaintainedSoloStreaks(maintainedSoloStreaks);

        const updatedSoloStreak = await streakoid.soloStreaks.getOne(soloStreakId);

        expect(updatedSoloStreak.streakName).toEqual(streakName);
        expect(updatedSoloStreak.status).toEqual(StreakStatus.live);
        expect(updatedSoloStreak.streakDescription).toEqual(streakDescription);
        expect(updatedSoloStreak.userId).toBeDefined();
        expect(updatedSoloStreak.completedToday).toEqual(false);
        expect(updatedSoloStreak.active).toEqual(true);
        expect(updatedSoloStreak.pastStreaks.length).toEqual(0);
        expect(updatedSoloStreak.timezone).toEqual(expect.any(String));
        const currentStreak = updatedSoloStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(1);
        expect(currentStreak.startDate).toEqual(expect.any(String));
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

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.maintainedStreak);
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent.streakId).toBeDefined();
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.solo);
        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });
});
