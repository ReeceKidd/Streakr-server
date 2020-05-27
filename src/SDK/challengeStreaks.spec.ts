import { GetAllChallengeStreaksSortFields, challengeStreaks as challengeStreaksImport } from './challengeStreaks';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';

describe('SDK challengeStreaks', () => {
    const getRequest = jest.fn().mockResolvedValue(true);
    const postRequest = jest.fn().mockResolvedValue(true);
    const patchRequest = jest.fn().mockResolvedValue(true);
    const challengeStreaks = challengeStreaksImport({
        getRequest,
        postRequest,
        patchRequest,
    });

    describe('getAll', () => {
        test('calls GET with correct URL when no query parameters are passed', async () => {
            expect.assertions(1);

            await challengeStreaks.getAll({});

            expect(getRequest).toBeCalledWith({ route: `/v1/challenge-streaks?` });
        });

        test('calls GET with correct URL when userId query parameters is passed', async () => {
            expect.assertions(1);

            const userId = 'userId';

            await challengeStreaks.getAll({ userId });

            expect(getRequest).toBeCalledWith({ route: `/v1/challenge-streaks?userId=${userId}&` });
        });

        test('calls GET with correct URL when challengeId query parameters is passed', async () => {
            expect.assertions(1);

            const challengeId = 'challengeId';

            await challengeStreaks.getAll({ challengeId });

            expect(getRequest).toBeCalledWith({ route: `/v1/challenge-streaks?challengeId=${challengeId}&` });
        });

        test('calls GET with correct URL when completedToday query parameters is passed', async () => {
            expect.assertions(1);

            const completedToday = true;

            await challengeStreaks.getAll({ completedToday });

            expect(getRequest).toBeCalledWith({ route: `/v1/challenge-streaks?completedToday=true&` });
        });

        test('calls GET with correct URL when timezone query parameters is passed', async () => {
            expect.assertions(1);

            const timezone = `Europe/London`;

            await challengeStreaks.getAll({ timezone });

            expect(getRequest).toBeCalledWith({ route: `/v1/challenge-streaks?timezone=${timezone}&` });
        });

        test('calls GET with correct URL when active query parameters is passed', async () => {
            expect.assertions(1);

            const active = true;

            await challengeStreaks.getAll({ active });

            expect(getRequest).toBeCalledWith({ route: `/v1/challenge-streaks?active=${active}&` });
        });

        test('calls GET with correct URL when status query parameters is passed', async () => {
            expect.assertions(1);

            const status = StreakStatus.live;

            await challengeStreaks.getAll({ status });

            expect(getRequest).toBeCalledWith({ route: `/v1/challenge-streaks?status=${status}&` });
        });

        test('calls GET with correct URL when sortField query parameters is passed', async () => {
            expect.assertions(1);

            const sortField = GetAllChallengeStreaksSortFields.currentStreak;

            await challengeStreaks.getAll({ sortField });

            expect(getRequest).toBeCalledWith({ route: `/v1/challenge-streaks?sortField=${sortField}&` });
        });
    });

    describe('getOne', () => {
        test('calls GET with correct URL', async () => {
            expect.assertions(1);

            await challengeStreaks.getOne({ challengeStreakId: 'id' });

            expect(getRequest).toBeCalledWith({ route: `/v1/challenge-streaks/id` });
        });
    });

    describe('create', () => {
        test('calls POST with correct URL and parameters', async () => {
            expect.assertions(1);

            const userId = 'userId';
            const challengeId = 'challengeId';

            await challengeStreaks.create({
                userId,
                challengeId,
            });

            expect(postRequest).toBeCalledWith({
                route: `/v1/challenge-streaks`,
                params: {
                    userId,
                    challengeId,
                },
            });
        });
    });

    describe('update', () => {
        test('calls PATCH with correct URL and parameters', async () => {
            expect.assertions(1);

            const completedToday = true;
            const timezone = 'Europe/London';

            const updateData = {
                completedToday,
                timezone,
            };

            await challengeStreaks.update({
                challengeStreakId: 'id',
                updateData,
            });

            expect(patchRequest).toBeCalledWith({
                route: `/v1/challenge-streaks/id`,
                params: updateData,
            });
        });
    });
});
