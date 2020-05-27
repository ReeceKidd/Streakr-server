import { GetAllSoloStreaksSortFields } from './soloStreaks';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { soloStreaks as soloStreaksImport } from './soloStreaks';

describe('SDK soloStreaks', () => {
    const getRequest = jest.fn().mockResolvedValue(true);
    const postRequest = jest.fn().mockResolvedValue(true);
    const patchRequest = jest.fn().mockResolvedValue(true);
    const soloStreaks = soloStreaksImport({
        getRequest,
        postRequest,
        patchRequest,
    });
    describe('getAll', () => {
        test('calls GET with correct URL when no query parameters are passed', async () => {
            expect.assertions(1);

            await soloStreaks.getAll({});

            expect(getRequest).toBeCalledWith({ route: `/v1/solo-streaks?` });
        });

        test('calls GET with correct URL when userId query paramter is passed', async () => {
            expect.assertions(1);

            const userId = 'userId';

            await soloStreaks.getAll({ userId });

            expect(getRequest).toBeCalledWith({ route: `/v1/solo-streaks?userId=${userId}&` });
        });

        test('calls GET with correct URL when completedToday query paramter is passed', async () => {
            expect.assertions(1);

            const completedToday = true;

            await soloStreaks.getAll({ completedToday });

            expect(getRequest).toBeCalledWith({ route: `/v1/solo-streaks?completedToday=true&` });
        });

        test('calls GET with correct URL when timezone query paramter is passed', async () => {
            expect.assertions(1);

            const timezone = `Europe/London`;

            await soloStreaks.getAll({ timezone });

            expect(getRequest).toBeCalledWith({ route: `/v1/solo-streaks?timezone=${timezone}&` });
        });

        test('calls GET with correct URL when active query paramter is passed', async () => {
            expect.assertions(1);

            const active = true;

            await soloStreaks.getAll({ active });

            expect(getRequest).toBeCalledWith({ route: `/v1/solo-streaks?active=${active}&` });
        });

        test('calls GET with correct URL when status query paramter is passed', async () => {
            expect.assertions(1);

            const status = StreakStatus.live;

            await soloStreaks.getAll({ status });

            expect(getRequest).toBeCalledWith({ route: `/v1/solo-streaks?status=${status}&` });
        });

        test('calls GET with correct URL when sortField paramter is passed', async () => {
            expect.assertions(1);

            const sortField = GetAllSoloStreaksSortFields.currentStreak;

            await soloStreaks.getAll({ sortField });

            expect(getRequest).toBeCalledWith({ route: `/v1/solo-streaks?sortField=${sortField}&` });
        });
    });

    describe('getOne', () => {
        test('calls GET with correct URL', async () => {
            expect.assertions(1);

            await soloStreaks.getOne('id');

            expect(getRequest).toBeCalledWith({ route: `/v1/solo-streaks/id` });
        });
    });

    describe('create', () => {
        test('calls POST with correct URL and  parameters', async () => {
            expect.assertions(1);

            const userId = 'userId';
            const streakName = 'streakName';
            const streakDescription = 'streakDescription';

            await soloStreaks.create({
                userId,
                streakName,
                streakDescription,
            });

            expect(postRequest).toBeCalledWith({
                route: `/v1/solo-streaks`,
                params: {
                    userId,
                    streakName,
                    streakDescription,
                },
            });
        });
    });

    describe('update', () => {
        test('calls PATCH with correct URL and  parameters', async () => {
            expect.assertions(1);

            const streakName = 'name';
            const streakDescription = 'description';
            const updateData = {
                streakName,
                streakDescription,
            };

            await soloStreaks.update({
                soloStreakId: 'id',
                updateData,
            });

            expect(patchRequest).toBeCalledWith({
                route: `/v1/solo-streaks/id`,
                params: {
                    ...updateData,
                },
            });
        });
    });
});
