import streakoid from "../../../src/sdk/streakoid";
import { StreakTypes } from "../../../src/Models/TypesOfStreak";

const email = "get-complete-solo-streak-task@gmail.com";
const username = "get-complete-solo-streak-task";

const streakName = "10 minutes journaling";

const timezone = "Europe/London";

jest.setTimeout(120000);

describe("GET /complete-solo-streak-tasks", () => {
  let userId: string;
  let soloStreakId: string;
  let completeSoloStreakTaskId: string;

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(username, email);
    userId = registrationResponse.data._id;

    const createSoloStreakResponse = await streakoid.soloStreaks.create(
      userId,
      streakName,
      timezone
    );
    soloStreakId = createSoloStreakResponse.data._id;

    const createSoloStreakTaskCompleteResponse = await streakoid.completeSoloStreakTasks.create(
      userId,
      soloStreakId,
      timezone
    );
    completeSoloStreakTaskId = createSoloStreakTaskCompleteResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
    await streakoid.soloStreaks.deleteOne(soloStreakId);
    await streakoid.completeSoloStreakTasks.deleteOne(completeSoloStreakTaskId);
  });

  test(`completeSoloStreakTasks can be retreived`, async () => {
    expect.assertions(11);

    const response = await streakoid.completeSoloStreakTasks.getAll(
      userId,
      soloStreakId
    );

    expect(response.status).toEqual(200);

    const { completeSoloStreakTasks } = response.data;

    expect(Object.keys(response.data)).toEqual(["completeSoloStreakTasks"]);

    const completeSoloStreakTask = completeSoloStreakTasks[0];

    expect(completeSoloStreakTask._id).toBeDefined();
    expect(completeSoloStreakTask.userId).toEqual(userId);
    expect(completeSoloStreakTask.streakId).toEqual(soloStreakId);
    expect(completeSoloStreakTask.taskCompleteTime).toEqual(expect.any(String));
    expect(completeSoloStreakTask.taskCompleteDay).toEqual(expect.any(String));
    expect(completeSoloStreakTask.streakType).toEqual(StreakTypes.soloStreak);
    expect(completeSoloStreakTask.createdAt).toBeDefined();
    expect(completeSoloStreakTask.updatedAt).toBeDefined();
    expect(Object.keys(completeSoloStreakTask)).toEqual([
      "_id",
      "userId",
      "streakId",
      "taskCompleteTime",
      "taskCompleteDay",
      "streakType",
      "createdAt",
      "updatedAt",
      "__v"
    ]);
  });
});
