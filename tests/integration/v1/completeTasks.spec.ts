import axios from "axios";

import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { userModel } from "../../../src/Models/User";
import { soloStreakModel, SoloStreak } from "../../../src/Models/SoloStreak";
import { completeTaskModel } from "../../../src/Models/CompleteTask";

import { SupportedRequestHeaders } from "../../../src/Server/headers";
import { ResponseCodes } from "../../../src/Server/responseCodes";
import APPLICATION_URL from "../../config";

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
      const registrationResponse = await axios({
        data: {
          username: registeredUsername,
          email: registeredEmail
        },
        method: "POST",
        url: registrationRoute
      });
      userId = registrationResponse.data._id;
      console.log(`UserId: ${userId}`);
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
        url: createSoloStreakRoute
      });
      soloStreakId = createSoloStreakResponse.data._id;
      console.log(`SoloStreakId: ${soloStreakId}`);
    } catch (err) {
      console.log(err);
    }
  });

  afterAll(async () => {
    await userModel.deleteOne({ email: registeredEmail });
    await soloStreakModel.deleteOne({ _id: soloStreakId });
    await soloStreakModel.deleteOne({ _id: secondSoloStreakId });
    await completeTaskModel.deleteOne({ userId, streakId: soloStreakId });
    await completeTaskModel.deleteOne({ userId, streakId: secondSoloStreakId });
  });

  describe("/v1/solo-streaks/{id}/complete-tasks", () => {
    test.only("that user can say that a task has been completed for the day", async () => {
      expect.assertions(6);

      try {
        console.log("Entered");
        const completeTaskResponse = await axios({
          data: {
            userId
          },
          headers: {
            [SupportedRequestHeaders.xTimezone]: londonTimezone
          },
          method: "POST",
          url: `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${soloStreakId}/${RouteCategories.completeTasks}`
        });
        const soloStreak = (await soloStreakModel.findById(
          soloStreakId
        )) as SoloStreak;
        const { data } = completeTaskResponse;
        console.log(data);

        expect(completeTaskResponse.status).toEqual(ResponseCodes.created);
        expect(data.completeTask._id).toBeDefined();
        expect(data.completeTask.taskCompleteTime).toBeDefined();
        expect(data.completeTask.userId).toEqual(userId);
        expect(data.completeTask.streakId).toEqual(soloStreakId);
        expect(soloStreak.currentStreak.startDate).toBeDefined();
        console.log("FINISHED");
      } catch (err) {
        console.log(err);
      }
    });

    test("that user cannot complete the same task in the same day", async done => {
      expect.assertions(3);
      try {
        const secondaryCreateSoloStreakResponse = await axios({
          data: {
            userId,
            name,
            description
          },
          headers: {
            [SupportedRequestHeaders.xTimezone]: londonTimezone
          },
          method: "POST",
          url: createSoloStreakRoute
        });
        secondSoloStreakId = secondaryCreateSoloStreakResponse.data.body._id;

        await axios({
          data: { userId },
          headers: {
            [SupportedRequestHeaders.xTimezone]: londonTimezone
          },
          method: "POST",
          url: `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${soloStreakId}/${RouteCategories.completeTasks}`
        });

        await axios({
          data: { userId },
          headers: {
            [SupportedRequestHeaders.xTimezone]: londonTimezone
          },
          method: "POST",
          url: `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${soloStreakId}/${RouteCategories.completeTasks}`
        });
        done();
      } catch (err) {
        expect(err.status).toEqual(ResponseCodes.unprocessableEntity);
        expect(err.data.body.message).toEqual("Task already completed today.");
        expect(err.data.body.code).toEqual("422-01");
      }
      done();
    });
  });
});
