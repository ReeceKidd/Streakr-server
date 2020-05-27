import { StreakoidFactory } from '../src/streakoid';
import { streakoidTest } from './setup/streakoidTest';
import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

jest.setTimeout(120000);

describe('POST /streak-tracking-events', () => {
    let streakoid: StreakoidFactory;
    let userId: string;
    let soloStreakId: string;
    let teamStreakId: string;
    let teamMemberStreakId: string;
    const streakName = 'Daily Spanish';
    const streakDescription = 'Everyday I must do 30 minutes of Spanish';

    beforeAll(async () => {
        if (isTestEnvironment()) {
            await setUpDatabase();
            const user = await getPayingUser();
            userId = user._id;
            streakoid = await streakoidTest();
            const soloStreak = await streakoid.soloStreaks.create({
                userId,
                streakName,
                streakDescription,
            });
            soloStreakId = soloStreak._id;

            const members = [{ memberId: userId }];

            const teamStreak = await streakoid.teamStreaks.create({
                creatorId: userId,
                streakName,
                streakDescription,
                members,
            });
            teamStreakId = teamStreak._id;

            const teamMemberStreak = await streakoid.teamMemberStreaks.create({
                userId,
                teamStreakId: teamStreak._id,
            });
            teamMemberStreakId = teamMemberStreak._id;
        }
    });

    afterAll(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase();
        }
    });

    test(`lost solo streak tracking events can be created`, async () => {
        expect.assertions(8);
        const streakTrackingEvent = await streakoid.streakTrackingEvents.create({
            type: StreakTrackingEventTypes.lostStreak,
            streakId: soloStreakId,
            userId,
            streakType: StreakTypes.solo,
        });

        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.lostStreak);
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent.streakId).toEqual(soloStreakId);
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.solo);

        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'userId', 'streakType', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });

    test(`maintained solo streak tracking events can be created`, async () => {
        expect.assertions(8);

        const streakTrackingEvent = await streakoid.streakTrackingEvents.create({
            type: StreakTrackingEventTypes.maintainedStreak,
            streakId: soloStreakId,
            userId,
            streakType: StreakTypes.solo,
        });

        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.maintainedStreak);
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent.streakId).toEqual(soloStreakId);
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.solo);

        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'userId', 'streakType', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });

    test(`inactive solo streak tracking events can be created`, async () => {
        expect.assertions(8);

        const streakTrackingEvent = await streakoid.streakTrackingEvents.create({
            type: StreakTrackingEventTypes.inactiveStreak,
            streakId: soloStreakId,
            userId,
            streakType: StreakTypes.solo,
        });

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.inactiveStreak);
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent.streakId).toEqual(soloStreakId);
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.solo);

        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'userId', 'streakType', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });

    test(`lost team member streak tracking events can be created`, async () => {
        expect.assertions(8);

        const streakTrackingEvent = await streakoid.streakTrackingEvents.create({
            type: StreakTrackingEventTypes.lostStreak,
            streakId: teamMemberStreakId,
            userId,
            streakType: StreakTypes.teamMember,
        });

        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.lostStreak);
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent.streakId).toEqual(teamMemberStreakId);
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.teamMember);
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'userId', 'streakType', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });

    test(`maintained team member streak tracking events can be created`, async () => {
        expect.assertions(8);

        const streakTrackingEvent = await streakoid.streakTrackingEvents.create({
            type: StreakTrackingEventTypes.maintainedStreak,
            streakId: teamMemberStreakId,
            userId,
            streakType: StreakTypes.teamMember,
        });

        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.maintainedStreak);
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent.streakId).toEqual(teamMemberStreakId);
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.teamMember);
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'userId', 'streakType', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });

    test(`inactive team member streak tracking events can be created`, async () => {
        expect.assertions(8);

        const streakTrackingEvent = await streakoid.streakTrackingEvents.create({
            type: StreakTrackingEventTypes.inactiveStreak,
            streakId: teamMemberStreakId,
            userId,
            streakType: StreakTypes.teamMember,
        });

        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.inactiveStreak);
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent.streakId).toEqual(teamMemberStreakId);
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.teamMember);
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'userId', 'streakType', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });

    test(`lost team streak tracking events can be created`, async () => {
        expect.assertions(8);

        const streakTrackingEvent = await streakoid.streakTrackingEvents.create({
            type: StreakTrackingEventTypes.lostStreak,
            streakId: teamStreakId,
            userId,
            streakType: StreakTypes.team,
        });

        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.lostStreak);
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent.streakId).toEqual(teamStreakId);
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.team);
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'userId', 'streakType', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });

    test(`maintained team streak tracking events can be created`, async () => {
        expect.assertions(8);

        const streakTrackingEvent = await streakoid.streakTrackingEvents.create({
            type: StreakTrackingEventTypes.maintainedStreak,
            streakId: teamStreakId,
            userId,
            streakType: StreakTypes.team,
        });

        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.maintainedStreak);
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent.streakId).toEqual(teamStreakId);
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.team);
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'userId', 'streakType', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });

    test(`inactive team streak tracking events can be created`, async () => {
        expect.assertions(8);

        const streakTrackingEvent = await streakoid.streakTrackingEvents.create({
            type: StreakTrackingEventTypes.inactiveStreak,
            streakId: teamStreakId,
            userId,
            streakType: StreakTypes.team,
        });

        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.inactiveStreak);
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent.streakId).toEqual(teamStreakId);
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.team);
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'userId', 'streakType', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });
});
