import axios from "axios";
import request from "supertest";

import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";

import { SupportedRequestHeaders } from "../../../src/Server/headers";
import { ResponseCodes } from "../../../src/Server/responseCodes";
import { getServiceConfig } from "../../../src/getServiceConfig";

const { APPLICATION_URL } = getServiceConfig();

const registeredEmail = "create-complete-tasks-user@gmail.com";
const registeredUsername = "create-complete-tasks-user";

const registrationRoute = `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.users}`;
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
    try {
      console.log(registrationRoute);
      const registrationResponse = await axios({
        data: {
          username: registeredUsername,
          email: registeredEmail
        },
        method: "POST",
        url: registrationRoute
      });
      console.log(registrationResponse.data);
      userId = registrationResponse.data.body._id;
      console.log(`User ID: ${userId}`);
      const createSoloStreakResponse = await axios({
        data: {
          userId,
          name,
          description
        },
        headers: {
          [SupportedRequestHeaders.xTimezone]: londonTimezone
        },
        method: "POST",
        url: registrationRoute
      });
      soloStreakId = createSoloStreakResponse.data.body._id;
      console.log(`Solo streak Id: ${soloStreakId}`);
    } catch (err) {
      console.log("ENTERED ERROR");
      console.log(err);
    }
  });

  afterAll(async () => {
    await axios({
      method: "DELETE",
      url: `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.users}/${userId}`
    });
    await axios({
      method: "DELETE",
      url: `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${soloStreakId}`
    });
    await axios({
      method: "DELETE",
      url: `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${secondSoloStreakId}`
    });
    const completeTasks = await request(APPLICATION_URL).get(
      `/${ApiVersions.v1}/${RouteCategories.completeTasks}?userId=${userId}`
    );
    await Promise.all(
      completeTasks.body.map((completeTask: any) => {
        return axios({
          method: "DELETE",
          url: `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.completeTasks}/${completeTask._id}`
        });
      })
    );
  });

  describe("POST /v1/complete-tasks", () => {
    test.only("user can say that a task has been completed for the day", async () => {
      expect.assertions(6);
      console.log(APPLICATION_URL);
      console.log(`/${ApiVersions.v1}/${RouteCategories.completeTasks}`);
      const completeTaskResponse = await request(APPLICATION_URL)
        .post(`/${ApiVersions.v1}/${RouteCategories.completeTasks}`)
        .send({ userId, soloStreakId })
        .set({ [SupportedRequestHeaders.xTimezone]: londonTimezone });
      console.log(completeTaskResponse.body);
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
        .get(`${ApiVersions.v1}/${RouteCategories.soloStreaks}/${soloStreakId}`)
        .set({ [SupportedRequestHeaders.xTimezone]: londonTimezone });
      expect(soloStreakResponse.body.currentStreak.startDate).toBeDefined();
    });

    test("user cannot complete the same task in the same day", async () => {
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
        .post(`/${ApiVersions.v1}/${RouteCategories.completeTasks}`)
        .send({ userId, soloStreakId })
        .set({ [SupportedRequestHeaders.xTimezone]: londonTimezone });
      const secondCompleteTaskResponse = await request(APPLICATION_URL)
        .post(`/${ApiVersions.v1}/${RouteCategories.completeTasks}`)
        .send({ userId, secondSoloStreakId })
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
