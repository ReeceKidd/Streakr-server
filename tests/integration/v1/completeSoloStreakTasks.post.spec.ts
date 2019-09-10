import streakoid from "../../../src/sdk/streakoid";
import { CompleteSoloStreakTask } from "../../../src/Models/CompleteSoloStreakTask";

const registeredEmail = "create-complete-solo-streak-tasks-user@gmail.com";
const registeredUsername = "create-complete-solo-streak-tasks-user";

const londonTimezone = "Europe/London";

jest.setTimeout(120000);

describe("POST /complete-solo-streak-tasks", () => {
  let userId: string;
  let soloStreakId: string;
  let secondSoloStreakId: string;

  const name = "Intermittent fasting";
  const description = "I will not eat until 1pm everyday";

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    userId = registrationResponse.data._id;

    const createSoloStreakResponse = await streakoid.soloStreaks.create(
      userId,
      name,
      londonTimezone,
      description
    );
    soloStreakId = createSoloStreakResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);

    await streakoid.soloStreaks.deleteOne(soloStreakId);
    await streakoid.soloStreaks.deleteOne(secondSoloStreakId);

    const completeSoloStreakTasksResponse = await streakoid.completeSoloStreakTasks.getAll(
      userId
    );
    await Promise.all(
      completeSoloStreakTasksResponse.data.completeSoloStreakTasks.map(
        (completeSoloStreakTask: CompleteSoloStreakTask) => {
          return streakoid.completeSoloStreakTasks.deleteOne(
            completeSoloStreakTask._id
          );
        }
      )
    );
  });

  describe("POST /v1/complete-solo-streak-tasks", () => {
    test("user can say that a solo streak task has been completed for the day", async () => {
      expect.assertions(6);

      const completeSoloStreakTaskResponse = await streakoid.completeSoloStreakTasks.create(
        userId,
        soloStreakId,
        londonTimezone
      );
      const soloStreakResponse = await streakoid.soloStreaks.getOne(
        soloStreakId
      );

      expect(completeSoloStreakTaskResponse.status).toEqual(201);
      expect(
        completeSoloStreakTaskResponse.data.completeSoloStreakTask._id
      ).toBeDefined();
      expect(
        completeSoloStreakTaskResponse.data.completeSoloStreakTask
          .taskCompleteTime
      ).toBeDefined();
      expect(
        completeSoloStreakTaskResponse.data.completeSoloStreakTask.userId
      ).toEqual(userId);
      expect(
        completeSoloStreakTaskResponse.data.completeSoloStreakTask.streakId
      ).toEqual(soloStreakId);

      expect(soloStreakResponse.data.currentStreak.startDate).toBeDefined();
    });

    test("user cannot complete the same solo streak task in the same day", async () => {
      expect.assertions(3);
      const secondaryCreateSoloStreakResponse = await streakoid.soloStreaks.create(
        userId,
        name,
        londonTimezone,
        description
      );
      secondSoloStreakId = secondaryCreateSoloStreakResponse.data._id;
      try {
        await streakoid.completeSoloStreakTasks.create(
          userId,
          secondSoloStreakId,
          londonTimezone
        );
        await streakoid.completeSoloStreakTasks.create(
          userId,
          secondSoloStreakId,
          londonTimezone
        );
      } catch (err) {
        expect(err.response.status).toEqual(422);
        expect(err.response.data.message).toEqual(
          "Task already completed today."
        );
        expect(err.response.data.code).toEqual("422-01");
      }
    });
  });
});
