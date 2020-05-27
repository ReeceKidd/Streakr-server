import { GetAllTeamStreaksSortFields } from './teamStreaks';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { CurrentStreak } from '@streakoid/streakoid-models/lib/Models/CurrentStreak';
import { PastStreak } from '@streakoid/streakoid-models/lib/Models/PastStreak';
import { teamStreaks as teamStreaksImport } from './teamStreaks';

describe('SDK TeamStreaks', () => {
    const getRequest = jest.fn().mockResolvedValue(true);
    const postRequest = jest.fn().mockResolvedValue(true);
    const patchRequest = jest.fn().mockResolvedValue(true);
    const deleteRequest = jest.fn().mockResolvedValue(true);
    const teamStreaks = teamStreaksImport({
        getRequest,
        postRequest,
        patchRequest,
        deleteRequest,
    });
    describe('getAll', () => {
        const creatorId = 'creatorId';
        const memberId = 'memberId';
        const timezone = 'Europe/London';
        const status = StreakStatus.live;
        const completedToday = true;
        const active = true;
        const sortField = GetAllTeamStreaksSortFields.currentStreak;

        const query = {
            creatorId,
            memberId,
            timezone,
            status,
            completedToday,
            active,
            sortField,
        };
        test('calls GET with correct URL when no query parameters are passed', async () => {
            expect.assertions(1);

            await teamStreaks.getAll({});

            expect(getRequest).toBeCalledWith({ route: `/v1/team-streaks?` });
        });

        test('calls GET with correct URL when creatorId query paramter is passed', async () => {
            expect.assertions(1);

            await teamStreaks.getAll({ creatorId });

            expect(getRequest).toBeCalledWith({ route: `/v1/team-streaks?creatorId=${creatorId}&` });
        });

        test('calls GET with correct URL when memberId query paramter is passed', async () => {
            expect.assertions(1);

            await teamStreaks.getAll({ memberId });

            expect(getRequest).toBeCalledWith({ route: `/v1/team-streaks?memberId=${memberId}&` });
        });

        test('calls GET with correct URL when timezone query paramter is passed', async () => {
            expect.assertions(1);

            await teamStreaks.getAll({ timezone });

            expect(getRequest).toBeCalledWith({ route: `/v1/team-streaks?timezone=${timezone}&` });
        });

        test('calls GET with correct URL when status query paramter is passed', async () => {
            expect.assertions(1);

            await teamStreaks.getAll({ status });

            expect(getRequest).toBeCalledWith({ route: `/v1/team-streaks?status=${status}&` });
        });

        test('calls GET with correct URL when completedToday query paramter is passed', async () => {
            expect.assertions(1);

            await teamStreaks.getAll({ completedToday });

            expect(getRequest).toBeCalledWith({ route: `/v1/team-streaks?completedToday=${completedToday}&` });
        });

        test('calls GET with correct URL when active query paramter is passed', async () => {
            expect.assertions(1);

            await teamStreaks.getAll({ active });

            expect(getRequest).toBeCalledWith({ route: `/v1/team-streaks?active=${active}&` });
        });

        test('calls GET with correct URL when sortField query paramter is passed', async () => {
            expect.assertions(1);

            await teamStreaks.getAll({ sortField });

            expect(getRequest).toBeCalledWith({ route: `/v1/team-streaks?sortField=${sortField}&` });
        });

        test('calls GET with correct URL when all parameters are passed', async () => {
            expect.assertions(1);

            await teamStreaks.getAll(query);

            expect(getRequest).toBeCalledWith({
                route: `/v1/team-streaks?creatorId=${creatorId}&memberId=${memberId}&timezone=${timezone}&status=${status}&completedToday=${completedToday}&active=${true}&sortField=${sortField}&`,
            });
        });
    });

    describe('getOne', () => {
        test('calls GET with correct URL', async () => {
            expect.assertions(1);

            await teamStreaks.getOne('id');

            expect(getRequest).toBeCalledWith({ route: `/v1/team-streaks/id` });
        });
    });

    describe('create', () => {
        test('calls POST with correct URL and  parameters', async () => {
            expect.assertions(1);

            const creatorId = 'abcdefgh';
            const streakName = 'Followed our calorie level';
            const streakDescription = 'Stuck to our recommended calorie level';

            const members: [] = [];

            await teamStreaks.create({
                creatorId,
                streakName,
                streakDescription,
                members,
            });

            expect(postRequest).toBeCalledWith({
                route: `/v1/team-streaks`,
                params: {
                    creatorId,
                    streakName,
                    streakDescription,
                    members,
                },
            });
        });
    });

    describe('update', () => {
        test('calls PATCH with correct URL and  parameters', async () => {
            expect.assertions(1);
            const streakName = 'streakName';
            const streakDescription = 'streakDescription';
            const numberOfMinutes = 30;
            const timezone = 'Europe/London';
            const status = StreakStatus.archived;
            const currentStreak: CurrentStreak = {
                startDate: new Date().toString(),
                numberOfDaysInARow: 1,
            };
            const pastStreaks: PastStreak[] = [];
            const completedToday = true;
            const active = true;

            const updateData = {
                streakName,
                streakDescription,
                numberOfMinutes,
                timezone,
                status,
                currentStreak,
                pastStreaks,
                completedToday,
                active,
            };

            await teamStreaks.update({
                teamStreakId: 'id',
                updateData,
            });

            expect(patchRequest).toBeCalledWith({ route: `/v1/team-streaks/id`, params: updateData });
        });
    });
});
