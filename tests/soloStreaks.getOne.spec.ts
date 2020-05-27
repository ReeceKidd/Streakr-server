import { StreakoidFactory, londonTimezone } from '../src/streakoid';
import { streakoidTest } from './setup/streakoidTest';
import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';

jest.setTimeout(120000);

describe('GET /complete-solo-streak-tasks', () => {
    let streakoid: StreakoidFactory;
    let userId: string;
    const streakName = 'Daily Spanish';
    const streakDescription = 'Everyday I must do 30 minutes of Spanish';

    beforeAll(async () => {
        if (isTestEnvironment()) {
            await setUpDatabase();
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

    test(`solo streak can be retrieved`, async () => {
        expect.assertions(14);

        const createdSoloStreak = await streakoid.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });

        const soloStreak = await streakoid.soloStreaks.getOne(createdSoloStreak._id);

        expect(soloStreak.streakName).toEqual(streakName);
        expect(soloStreak.status).toEqual(StreakStatus.live);
        expect(soloStreak.streakDescription).toEqual(streakDescription);
        expect(soloStreak.userId).toBeDefined();
        expect(soloStreak.completedToday).toEqual(false);
        expect(soloStreak.active).toEqual(false);
        expect(soloStreak.pastStreaks).toEqual([]);
        expect(soloStreak.timezone).toEqual(londonTimezone);
        expect(soloStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(soloStreak.currentStreak)).toEqual(['numberOfDaysInARow']);
        expect(soloStreak._id).toEqual(expect.any(String));
        expect(soloStreak.createdAt).toEqual(expect.any(String));
        expect(soloStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(soloStreak).sort()).toEqual(
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
    });

    test(`sends solo streak does not exist error when solo streak doesn't exist`, async () => {
        expect.assertions(5);

        try {
            await streakoid.soloStreaks.getOne('5d54487483233622e43270f9');
        } catch (err) {
            const { data } = err.response;
            const { code, message, httpStatusCode } = data;
            expect(err.response.status).toEqual(400);
            expect(code).toEqual('400-07');
            expect(message).toEqual('Solo streak does not exist.');
            expect(httpStatusCode).toEqual(400);
            expect(Object.keys(data).sort()).toEqual(['code', 'message', 'httpStatusCode'].sort());
        }
    });
});
