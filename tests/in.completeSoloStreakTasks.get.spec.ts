import { StreakoidFactory } from '../src/streakoid';
import { streakoidTest } from './setup/streakoidTest';
import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';

jest.setTimeout(120000);

describe('GET /complete-solo-streak-tasks', () => {
    let streakoid: StreakoidFactory;
    let userId: string;
    const streakName = 'Daily Spanish';

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

    test(`IncompleteSoloStreakTasks can be retrieved`, async () => {
        expect.assertions(8);

        const soloStreak = await streakoid.soloStreaks.create({
            userId,
            streakName,
        });

        const soloStreakId = soloStreak._id;

        // Solo streak tasks must be completed before they can be incompleted

        await streakoid.completeSoloStreakTasks.create({
            userId,
            soloStreakId,
        });

        await streakoid.incompleteSoloStreakTasks.create({
            userId,
            soloStreakId,
        });

        const incompleteSoloStreakTasks = await streakoid.incompleteSoloStreakTasks.getAll({
            userId,
            streakId: soloStreakId,
        });

        const incompleteSoloStreakTask = incompleteSoloStreakTasks[0];

        expect(incompleteSoloStreakTask._id).toEqual(expect.any(String));
        expect(incompleteSoloStreakTask.userId).toBeDefined();
        expect(incompleteSoloStreakTask.streakId).toEqual(soloStreakId);
        expect(incompleteSoloStreakTask.taskIncompleteTime).toEqual(expect.any(String));
        expect(incompleteSoloStreakTask.taskIncompleteDay).toEqual(expect.any(String));
        expect(incompleteSoloStreakTask.createdAt).toEqual(expect.any(String));
        expect(incompleteSoloStreakTask.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(incompleteSoloStreakTask).sort()).toEqual(
            [
                '_id',
                'userId',
                'streakId',
                'taskIncompleteTime',
                'taskIncompleteDay',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });
});
