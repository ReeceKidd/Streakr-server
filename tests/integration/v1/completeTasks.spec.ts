import request from "supertest";

import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { userModel } from "../../../src/Models/User";
import { soloStreakModel, SoloStreak } from "../../../src/Models/SoloStreak";
import { completeTaskModel } from "../../../src/Models/CompleteTask";

import { SupportedRequestHeaders } from "../../../src/Server/headers";
import { ResponseCodes } from "../../../src/Server/responseCodes";
import { getServiceConfig } from "../../../src/getServiceConfig";

const { APPLICATION_URL } = getServiceConfig();

const registeredEmail = "create-complete-tasks-user@gmail.com";
const registeredUsername = "create-complete-tasks-user";

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;
const createSoloStreakRoute = `/${ApiVersions.v1}/${RouteCategories.soloStreaks}`;

const londonTimezone = "Europe/London";

jest.setTimeout(120000);

describe(createSoloStreakRoute, () => {
  let userId: string;
  let soloStreakId: string;
  let secondSoloStreakId: string;

  const name = "Intermittent fasting";
  const description = "I will not eat until 1pm everyday";

  beforeAll(async () => {
    const registrationResponse = await request(APPLICATION_URL)
      .post(registrationRoute)
      .send({
        username: registeredUsername,
        email: registeredEmail
      });
    userId = registrationResponse.body._id;
    const createSoloStreakResponse = await request(APPLICATION_URL)
      .post(createSoloStreakRoute)
      .send({
        userId,
        name,
        description
      })
      .set({ [SupportedRequestHeaders.xTimezone]: londonTimezone });
    soloStreakId = createSoloStreakResponse.body._id;
  });

  afterAll(async () => {
    console.log(`/${ApiVersions.v1}/${RouteCategories.users}/${userId}`);
    await request(APPLICATION_URL).delete(
      `/${ApiVersions.v1}/${RouteCategories.users}/${userId}`
    );
    console.log(
      `/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${soloStreakId}`
    );
    await request(APPLICATION_URL).delete(
      `/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${soloStreakId}`
    );
    await request(APPLICATION_URL).delete(
      `/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${secondSoloStreakId}`
    );
    console.log(
      `/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${secondSoloStreakId}`
    );
    const completeTasks = await request(APPLICATION_URL).get(
      `/${ApiVersions.v1}/${RouteCategories.completeTasks}?userId=${userId}`
    );
    console.log(completeTasks.body);
    await Promise.all(
      completeTasks.body.map((completeTask: any) => {
        return request(APPLICATION_URL).delete(
          `/${ApiVersions.v1}/${RouteCategories.completeTasks}/${completeTask.id}`
        );
      })
    );
  });

  describe("/v1/solo-streaks/{id}/complete-tasks", () => {
    test("that user can say that a task has been completed for the day", async () => {
      expect.assertions(6);
      const completeTaskResponse = await request(APPLICATION_URL)
        .post(
          `/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${soloStreakId}/${RouteCategories.completeTasks}`
        )
        .send({ userId })
        .set({ [SupportedRequestHeaders.xTimezone]: londonTimezone });
      expect(completeTaskResponse.status).toEqual(ResponseCodes.created);
      expect(completeTaskResponse.body.completeTask._id).toBeDefined();
      expect(
        completeTaskResponse.body.completeTask.taskCompleteTime
      ).toBeDefined();
      expect(completeTaskResponse.body.completeTask.userId).toEqual(userId);
      expect(completeTaskResponse.body.completeTask.streakId).toEqual(
        soloStreakId
      );
      const soloStreakResponse = await request(APPLICATION_URL)
        .get(
          `/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${soloStreakId}`
        )
        .set({ [SupportedRequestHeaders.xTimezone]: londonTimezone });
      expect(soloStreakResponse.body.currentStreak.startDate).toBeDefined();
    });

    test("that user cannot complete the same task in the same day", async () => {
      expect.assertions(3);
      const secondaryCreateSoloStreakResponse = await request(APPLICATION_URL)
        .post(createSoloStreakRoute)
        .send({
          userId,
          name,
          description
        })
        .set({ [SupportedRequestHeaders.xTimezone]: londonTimezone });
      secondSoloStreakId = secondaryCreateSoloStreakResponse.body._id;
      await request(APPLICATION_URL)
        .post(
          `/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${secondSoloStreakId}/${RouteCategories.completeTasks}`
        )
        .send({ userId })
        .set({ [SupportedRequestHeaders.xTimezone]: londonTimezone });
      const secondCompleteTaskResponse = await request(APPLICATION_URL)
        .post(
          `/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${secondSoloStreakId}/${RouteCategories.completeTasks}`
        )
        .send({ userId })
        .set({ [SupportedRequestHeaders.xTimezone]: londonTimezone });
      expect(secondCompleteTaskResponse.status).toEqual(
        ResponseCodes.unprocessableEntity
      );
      expect(secondCompleteTaskResponse.body.message).toEqual(
        "Task already completed today."
      );
      expect(secondCompleteTaskResponse.body.code).toEqual("422-01");
    });
  });
});
