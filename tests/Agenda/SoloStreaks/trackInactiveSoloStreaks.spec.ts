import StreakStatus from '@streakoid/streakoid-sdk/lib/StreakStatus';
import { StreakTrackingEventTypes, StreakTypes } from '@streakoid/streakoid-sdk/lib';
import { trackInactiveSoloStreaks } from '../../../src/Agenda/SoloStreaks/trackInactiveSoloStreaks';
import { StreakoidFactory } from '@streakoid/streakoid-sdk/lib/streakoid';
import { isTestEnvironment } from '../../../tests/setup/isTestEnvironment';
import { connectToDatabase } from '../../../tests/setup/connectToDatabase';
import { getPayingUser } from '../../setup/getPayingUser';
import { streakoidTest } from '../../../tests/setup/streakoidTest';
import { tearDownDatabase } from '../../../tests/setup/tearDownDatabase';

jest.setTimeout(120000);

describe('trackInactiveSoloStreak', () => {
    let streakoid: StreakoidFactory;
    let userId: string;
    const streakName = 'Daily Spanish';
    const streakDescription = 'Everyday I must do Spanish';

    beforeAll(async () => {
        if (isTestEnvironment()) {
            await connectToDatabase();
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

    test('creates a streak inactive tracking event', async () => {
        expect.assertions(21);

        const soloStreak = await streakoid.soloStreaks.create({ userId, streakName, streakDescription });
        const soloStreakId = soloStreak._id;

        const inactiveSoloStreaks = await streakoid.soloStreaks.getAll({
            completedToday: false,
            active: false,
        });

        await trackInactiveSoloStreaks(inactiveSoloStreaks);

        const updatedSoloStreak = await streakoid.soloStreaks.getOne(soloStreakId);

        expect(updatedSoloStreak.streakName).toEqual(streakName);
        expect(updatedSoloStreak.status).toEqual(StreakStatus.live);
        expect(updatedSoloStreak.userId).toBeDefined();
        expect(updatedSoloStreak.completedToday).toEqual(false);
        expect(updatedSoloStreak.active).toEqual(false);
        expect(updatedSoloStreak.pastStreaks.length).toEqual(0);
        expect(updatedSoloStreak.timezone).toEqual(expect.any(String));
        const currentStreak = updatedSoloStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(currentStreak)).toEqual(['numberOfDaysInARow']);
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

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.inactiveStreak);
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
