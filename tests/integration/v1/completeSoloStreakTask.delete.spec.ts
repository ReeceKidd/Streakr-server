import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "delete-complete-solo-streak-tasks-user@gmail.com";
const registeredUsername = "delete-solo-streak-tasks-user";

const timezone = "Europe/London";

jest.setTimeout(120000);

describe("DELETE /complete-solo-streak-tasks", () => {
  let userId: string;
  let soloStreakId: string;
  let completeSoloStreakTaskId: string;

  const streakName = "Intermittent fasting";

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    userId = registrationResponse.data._id;

    const createSoloStreakResponse = await streakoid.soloStreaks.create(
      userId,
      streakName,
      timezone
    );
    soloStreakId = createSoloStreakResponse.data._id;

    const completeSoloStreakTaskResponse = await streakoid.completeSoloStreakTasks.create(
      userId,
      soloStreakId,
      timezone
    );
    completeSoloStreakTaskId = completeSoloStreakTaskResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
    await streakoid.soloStreaks.deleteOne(soloStreakId);
  });

  describe("DELETE /v1/complete-solo-streak-tasks", () => {
    test("deletes complete-solo-streak-tasks", async () => {
      expect.assertions(1);

      const response = await streakoid.completeSoloStreakTasks.deleteOne(
        completeSoloStreakTaskId
      );

      expect(response.status).toEqual(204);
    });
  });
});
