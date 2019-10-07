import { trackMaintainedSoloStreaks } from '.../../../src/Agenda/SoloStreaks/trackMaintainedSoloStreaks';
import streakoid from '../../src/streakoid';
import StreakTrackingEventType from '@streakoid/streakoid-sdk/lib/streakTrackingEventType';
import StreakStatus from '@streakoid/streakoid-sdk/lib/StreakStatus';

const username = 'trackInactiveSoloStreakUsername';
const email = 'trackInactiveSoloStreak@gmail.com';

jest.setTimeout(120000);

describe('trackInactiveSoloStreak', () => {
    let userId: string;
    let soloStreakId: string;
    let streakTrackingEventId: string;

    const streakName = 'Daily Programming';
    const streakDescription = 'I will program for one hour everyday';

    beforeAll(async () => {
        const user = await streakoid.users.create({ username, email });
        userId = user._id;

        const soloStreak = await streakoid.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });
        soloStreakId = soloStreak._id;
    });

    afterAll(async () => {
        await streakoid.users.deleteOne(userId);
        await streakoid.soloStreaks.deleteOne(soloStreakId);
        await streakoid.streakTrackingEvents.deleteOne(streakTrackingEventId);
    });

    test('updates solo streak activity and creates a streak inactive tracking event', async () => {
        expect.assertions(21);

        const inactiveSoloStreaks = await streakoid.soloStreaks.getAll({
            completedToday: false,
            active: false,
        });

        const maintainedSoloStreaksPromises = await trackMaintainedSoloStreaks(inactiveSoloStreaks);

        await Promise.all(maintainedSoloStreaksPromises);

        const updatedSoloStreak = await streakoid.soloStreaks.getOne(soloStreakId);

        expect(updatedSoloStreak.streakName).toEqual(streakName);
        expect(updatedSoloStreak.status).toEqual(StreakStatus.live);
        expect(updatedSoloStreak.streakDescription).toEqual(streakDescription);
        expect(updatedSoloStreak.userId).toEqual(userId);
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

        streakTrackingEventId = streakTrackingEvent._id;

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventType.MaintainedStreak);
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent.streakId).toBeDefined();
        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });
});
