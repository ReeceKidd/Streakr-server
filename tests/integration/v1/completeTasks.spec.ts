import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { ResponseCodes } from "../../../src/Server/responseCodes";
import { getServiceConfig } from "../../../src/getServiceConfig";
import streakoid from "../../../src/sdk/streakoid";
import { CompleteTask } from "../../../src/Models/CompleteTask";

const { APPLICATION_URL } = getServiceConfig();

const registeredEmail = "create-complete-tasks-user@gmail.com";
const registeredUsername = "create-complete-tasks-user";

const createSoloStreakRoute = `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.soloStreaks}`;

const londonTimezone = "Europe/London";

jest.setTimeout(120000);

describe(createSoloStreakRoute, () => {
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
      description,
      londonTimezone
    );
    soloStreakId = createSoloStreakResponse.data._id;
  });

  afterAll(async () => {
    try {
      await streakoid.users.deleteOne(userId);

      await streakoid.soloStreaks.deleteOne(soloStreakId);
      await streakoid.soloStreaks.deleteOne(secondSoloStreakId);

      const completeTasksResponse = await streakoid.completeTasks.getAll(
        userId
      );
      await Promise.all(
        completeTasksResponse.data.completeTasks.map(
          (completeTask: CompleteTask) => {
            return streakoid.completeTasks.deleteOne(completeTask._id);
          }
        )
      );
      console.log("FINISHED");
    } catch (err) {
      console.log(err.response.data);
    }
  });

  describe("POST /v1/complete-tasks", () => {
    test("user can say that a task has been completed for the day", async () => {
      expect.assertions(6);

      const completeTaskResponse = await streakoid.completeTasks.create(
        userId,
        soloStreakId,
        londonTimezone
      );
      const soloStreakResponse = await streakoid.soloStreaks.getOne(
        soloStreakId
      );

      expect(completeTaskResponse.status).toEqual(ResponseCodes.created);
      expect(completeTaskResponse.data.completeTask._id).toBeDefined();
      expect(
        completeTaskResponse.data.completeTask.taskCompleteTime
      ).toBeDefined();
      expect(completeTaskResponse.data.completeTask.userId).toEqual(userId);
      expect(completeTaskResponse.data.completeTask.streakId).toEqual(
        soloStreakId
      );

      expect(soloStreakResponse.data.currentStreak.startDate).toBeDefined();
    });

    test("user cannot complete the same task in the same day", async () => {
      expect.assertions(3);
      const secondaryCreateSoloStreakResponse = await streakoid.soloStreaks.create(
        userId,
        name,
        description,
        londonTimezone
      );
      secondSoloStreakId = secondaryCreateSoloStreakResponse.data._id;
      try {
        await streakoid.completeTasks.create(
          userId,
          secondSoloStreakId,
          londonTimezone
        );
        await streakoid.completeTasks.create(
          userId,
          secondSoloStreakId,
          londonTimezone
        );
      } catch (err) {
        expect(err.response.status).toEqual(ResponseCodes.unprocessableEntity);
        expect(err.response.data.message).toEqual(
          "Task already completed today."
        );
        expect(err.response.data.code).toEqual("422-01");
      }
    });
  });
});
