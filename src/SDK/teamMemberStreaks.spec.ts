import { teamMemberStreaks as teamMemberStreaksImport } from './teamMemberStreaks';
describe('SDK teamMemberStreaks', () => {
    const getRequest = jest.fn().mockResolvedValue(true);
    const postRequest = jest.fn().mockResolvedValue(true);
    const patchRequest = jest.fn().mockResolvedValue(true);
    const teamMemberStreaks = teamMemberStreaksImport({
        getRequest,
        postRequest,
        patchRequest,
    });

    describe('getAll', () => {
        const userId = 'userId';
        const teamStreakId = 'teamStreakId';
        const completedToday = true;
        const timezone = 'Europe/London';
        const active = true;

        const query = {
            userId,
            teamStreakId,
            completedToday,
            timezone,
            active,
        };

        test('calls GET with correct URL when no query parameters are passed', async () => {
            expect.assertions(1);

            await teamMemberStreaks.getAll({});

            expect(getRequest).toBeCalledWith({ route: `/v1/team-member-streaks?` });
        });

        test('calls GET with correct URL when userId query paramter is passed', async () => {
            expect.assertions(1);

            await teamMemberStreaks.getAll({ userId });

            expect(getRequest).toBeCalledWith({ route: `/v1/team-member-streaks?userId=${userId}&` });
        });

        test('calls GET with correct URL when teamStreakId query paramter is passed', async () => {
            expect.assertions(1);

            await teamMemberStreaks.getAll({ teamStreakId });

            expect(getRequest).toBeCalledWith({ route: `/v1/team-member-streaks?teamStreakId=${teamStreakId}&` });
        });

        test('calls GET with correct URL when completedToday query paramter is passed', async () => {
            expect.assertions(1);

            await teamMemberStreaks.getAll({ completedToday });

            expect(getRequest).toBeCalledWith({ route: `/v1/team-member-streaks?completedToday=true&` });
        });

        test('calls GET with correct URL when timezone query paramter is passed', async () => {
            expect.assertions(1);

            await teamMemberStreaks.getAll({ timezone });

            expect(getRequest).toBeCalledWith({ route: `/v1/team-member-streaks?timezone=${timezone}&` });
        });

        test('calls GET with correct URL when active query paramter is passed', async () => {
            expect.assertions(1);

            await teamMemberStreaks.getAll({ active });

            expect(getRequest).toBeCalledWith({ route: `/v1/team-member-streaks?active=${active}` });
        });

        test('calls GET with correct URL when all query parameters are passed', async () => {
            expect.assertions(1);

            await teamMemberStreaks.getAll(query);

            expect(getRequest).toBeCalledWith({
                route: `/v1/team-member-streaks?userId=${userId}&teamStreakId=${teamStreakId}&completedToday=${completedToday}&timezone=${timezone}&active=${active}`,
            });
        });
    });

    describe('getOne', () => {
        test('calls GET with correct URL', async () => {
            expect.assertions(1);

            await teamMemberStreaks.getOne('id');

            expect(getRequest).toBeCalledWith({ route: `/v1/team-member-streaks/id` });
        });
    });

    describe('create', () => {
        test('calls POST with correct URL and  parameters', async () => {
            expect.assertions(1);

            const userId = 'userId';
            const teamStreakId = 'teamStreakId';

            await teamMemberStreaks.create({
                userId,
                teamStreakId,
            });

            expect(postRequest).toBeCalledWith({
                route: `/v1/team-member-streaks`,
                params: {
                    userId,
                    teamStreakId,
                },
            });
        });
    });

    describe('update', () => {
        test('calls PATCH with correct URL and  parameters', async () => {
            expect.assertions(1);

            const timezone = 'Europe/Paris';
            const updateData = {
                timezone,
            };

            await teamMemberStreaks.update({
                teamMemberStreakId: 'id',
                updateData,
            });

            expect(patchRequest).toBeCalledWith({
                route: `/v1/team-member-streaks/id`,
                params: updateData,
            });
        });
    });
});
