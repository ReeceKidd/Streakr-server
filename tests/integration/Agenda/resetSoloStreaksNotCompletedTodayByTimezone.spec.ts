import { soloStreakModel, SoloStreak } from "../../../src/Models/SoloStreak";
import request from "supertest";

import server from "../../../src/app";
import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { AuthPaths } from "../../../src/Routers/authRouter";
import { SupportedRequestHeaders } from "../../../src/Server/headers";
import { userModel } from "../../../src/Models/User";
import { getIncompleteSoloStreaks } from "../../../src/Agenda/getIncompleteSoloStreaks";
import { resetSoloStreaksNotCompletedTodayByTimezone } from "../../../src/Agenda/resetSoloStreaksNotCompletedTodayByTimezone";
import { resetIncompleteSoloStreaks } from "../../../src/Agenda/resetIncompleteSoloStreaks";

const registeredUserName = "getIncompleteSoloStreaksUsername";
const registeredEmail = "getIncompleteSoloStreaksRegisteredEmail@gmail.com";
const registeredPassword = "getIncompleteSoloStreaksRegisteredPassword";

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;
const loginRoute = `/${ApiVersions.v1}/${RouteCategories.auth}/${AuthPaths.login}`;
const soloStreakRoute = `/${ApiVersions.v1}/${RouteCategories.soloStreaks}`;

jest.setTimeout(120000);

describe("resetSoloStreaksNotCompletedTodayByTimezone", () => {
  let userId: string;
  let jsonWebToken: string;
  let soloStreakId: string;
  const name = "Intermittent fasting";
  const description = "I will fast until 1pm everyday";
  const timezone = "Europe/London";

  beforeAll(async done => {
    const registrationResponse = await request(server)
      .post(registrationRoute)
      .send({
        userName: registeredUserName,
        email: registeredEmail,
        password: registeredPassword
      });
    userId = registrationResponse.body._id;
    const loginResponse = await request(server)
      .post(loginRoute)
      .send({
        email: registeredEmail,
        password: registeredPassword
      });
    jsonWebToken = loginResponse.body.jsonWebToken;
    const createSoloStreakResponse = await request(server)
      .post(soloStreakRoute)
      .set({ "x-access-token": jsonWebToken })
      .set({ "x-timezone": timezone })
      .send({
        userId,
        name,
        description
      });
    soloStreakId = createSoloStreakResponse.body._id;
    done();
  });

  afterAll(async done => {
    await userModel.deleteOne({ email: registeredEmail });
    await soloStreakModel.deleteOne({ _id: soloStreakId });
    done();
  });

  test("that getIncompleteSoloStreaks returns solo streaks that were not completed today", async done => {
    expect.assertions(3);
    /*
      Have to force soloStreak to have new date because streaks without a new date aren't
      considered incomplete as they haven't been started
      */
    // Why am I doing this can I not just complete this task for today?
    await soloStreakModel.findByIdAndUpdate(soloStreakId, {
      currentStreak: { startDate: new Date() }
    });
    const defaultCurrentStreak = {
      startDate: undefined,
      numberOfDaysInARow: 0
    };
    const endDate = new Date();
    const resetSoloStreaksPromises = await resetSoloStreaksNotCompletedTodayByTimezone(
      soloStreakModel,
      getIncompleteSoloStreaks,
      resetIncompleteSoloStreaks,
      timezone,
      defaultCurrentStreak,
      endDate
    );
    await Promise.all(resetSoloStreaksPromises);
    const updatedSoloStreak: any = await soloStreakModel.findById(soloStreakId);
    expect(updatedSoloStreak.currentStreak.endDate).toBeUndefined();
    expect(updatedSoloStreak.pastStreaks.length).toBe(1);
    expect(updatedSoloStreak.pastStreaks[0].endDate).toEqual(endDate);
    done();
  });
});
