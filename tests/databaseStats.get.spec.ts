import { StreakoidFactory } from '../src/streakoid';
import { streakoidTest } from './setup/streakoidTest';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getPayingUser } from './setup/getPayingUser';

jest.setTimeout(120000);

describe('GET /database-stats', () => {
    let streakoid: StreakoidFactory;

    beforeAll(async () => {
        if (isTestEnvironment()) {
            await setUpDatabase();
            streakoid = await streakoidTest();
            const user = await getPayingUser();
            await streakoid.soloStreaks.create({ userId: user._id, streakName: 'Reading' });
            const challenge = await streakoid.challenges.create({
                name: 'Meditation',
                description: 'Must meditate',
                icon: 'brain',
                color: 'blue',
            });
            await streakoid.challengeStreaks.create({ userId: user._id, challengeId: challenge.challenge._id });
            await streakoid.teamStreaks.create({
                creatorId: user._id,
                streakName: 'Running',
                members: [{ memberId: user._id }],
            });
        }
    });

    afterAll(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase();
        }
    });

    test(`gets database stats`, async () => {
        expect.assertions(6);

        const databaseStats = await streakoid.databaseStats.get();

        expect(databaseStats.totalLiveChallengeStreaks).toEqual(1);
        expect(databaseStats.totalLiveSoloStreaks).toEqual(1);
        expect(databaseStats.totalLiveTeamStreaks).toEqual(1);
        expect(databaseStats.totalStreaks).toEqual(3);
        expect(databaseStats.totalUsers).toEqual(1);

        expect(Object.keys(databaseStats).sort()).toEqual(
            [
                'totalLiveChallengeStreaks',
                'totalLiveSoloStreaks',
                'totalLiveTeamStreaks',
                'totalStreaks',
                'totalUsers',
            ].sort(),
        );
    });
});
