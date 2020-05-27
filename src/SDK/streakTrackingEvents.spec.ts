import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import { streakTrackingEvents as streakTrackingEventsImport } from './streakTrackingEvents';

describe('SDK streakTrackingEvents', () => {
    const getRequest = jest.fn().mockResolvedValue(true);
    const postRequest = jest.fn().mockResolvedValue(true);
    const streakTrackingEvents = streakTrackingEventsImport({
        getRequest,
        postRequest,
    });
    describe('getAll', () => {
        const type = StreakTrackingEventTypes.inactiveStreak;
        const userId = 'userId';
        const streakId = 'streakId';
        const streakType = StreakTypes.team;
        const query = {
            type,
            userId,
            streakId,
            streakType,
        };
        test('calls GET with correct URL when no query parameters are passed', async () => {
            expect.assertions(1);

            await streakTrackingEvents.getAll({});

            expect(getRequest).toBeCalledWith({ route: `/v1/streak-tracking-events?` });
        });

        test(`calls GET with correct URL when all query parameters are passed`, async () => {
            expect.assertions(1);

            await streakTrackingEvents.getAll(query);

            expect(getRequest).toBeCalledWith({
                route: `/v1/streak-tracking-events?type=${type}&userId=${userId}&streakId=${streakId}&streakType=${streakType}&`,
            });
        });

        test('calls GET with correct URL when type query paramter is passed', async () => {
            expect.assertions(1);

            await streakTrackingEvents.getAll({ type });

            expect(getRequest).toBeCalledWith({ route: `/v1/streak-tracking-events?type=${type}&` });
        });

        test('calls GET with correct URL when userId query paramter is passed', async () => {
            expect.assertions(1);

            await streakTrackingEvents.getAll({ userId });

            expect(getRequest).toBeCalledWith({ route: `/v1/streak-tracking-events?userId=${userId}&` });
        });

        test('calls GET with correct URL when streakId query paramter is passed', async () => {
            expect.assertions(1);

            await streakTrackingEvents.getAll({ streakId });

            expect(getRequest).toBeCalledWith({ route: `/v1/streak-tracking-events?streakId=${streakId}&` });
        });

        test('calls GET with correct URL when streakType query paramter is passed', async () => {
            expect.assertions(1);

            await streakTrackingEvents.getAll({ streakType });

            expect(getRequest).toBeCalledWith({ route: `/v1/streak-tracking-events?streakType=${streakType}&` });
        });

        test('calls GET with correct URL when streakType query paramter is passed', async () => {
            expect.assertions(1);

            await streakTrackingEvents.getAll({ streakType });

            expect(getRequest).toBeCalledWith({ route: `/v1/streak-tracking-events?streakType=${streakType}&` });
        });
    });

    describe('getOne', () => {
        test('calls GET with correct URL', async () => {
            expect.assertions(1);

            await streakTrackingEvents.getOne('id');

            expect(getRequest).toBeCalledWith({ route: `/v1/streak-tracking-events/id` });
        });
    });

    describe('create', () => {
        test('calls POST with all available parameters', async () => {
            expect.assertions(1);

            const type = StreakTrackingEventTypes.inactiveStreak;
            const streakId = 'streakId';
            const userId = 'userId';
            const streakType = StreakTypes.team;

            await streakTrackingEvents.create({ type, streakId, userId, streakType });

            expect(postRequest).toBeCalledWith({
                route: `/v1/streak-tracking-events`,
                params: {
                    type,
                    streakId,
                    userId,
                    streakType,
                },
            });
        });

        test('calls POST without userId', async () => {
            expect.assertions(1);

            const type = StreakTrackingEventTypes.inactiveStreak;
            const streakId = 'streakId';
            const streakType = StreakTypes.team;

            await streakTrackingEvents.create({ type, streakId, streakType });

            expect(postRequest).toBeCalledWith({
                route: `/v1/streak-tracking-events`,
                params: {
                    type,
                    streakId,
                    streakType,
                },
            });
        });
    });
});
