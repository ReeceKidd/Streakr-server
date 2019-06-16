import {
  soloStreakModel,
  soloStreakSchema,
  SoloStreak
} from "../../../src/Models/SoloStreak";
import request from "supertest";

import server from "../../../src/app";
import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { AuthPaths } from "../../../src/Routers/authRouter";
import { SupportedRequestHeaders } from "../../../src/Server/headers";
import { userModel } from "../../../src/Models/User";
import { getIncompleteSoloStreaks } from "../../../src/Agenda/getIncompleteSoloStreaks";

const registeredUserName = "getIncompleteSoloStreaksUsername";
const registeredEmail = "getIncompleteSoloStreaksRegisteredEmail@gmail.com";
const registeredPassword = "getIncompleteSoloStreaksRegisteredPassword";

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;
const loginRoute = `/${ApiVersions.v1}/${RouteCategories.auth}/${AuthPaths.login}`;
const soloStreakRoute = `/${ApiVersions.v1}/${RouteCategories.soloStreaks}`;

jest.setTimeout(120000);

describe("getIncompleteSoloStreaks", () => {
  let userId: string;
  let jsonWebToken: string;
  let soloStreakId: string;
  const name = "Intermittent fasting";
  const description = "I will fast until 1pm everyday";
  const timezone = "America/Los_Angeles";

  beforeAll(async () => {
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
      .send({
        userId,
        name,
        description
      })
      .set({ [SupportedRequestHeaders.xAccessToken]: jsonWebToken })
      .set({ [SupportedRequestHeaders.xTimezone]: timezone });
    soloStreakId = createSoloStreakResponse.body._id;
  });

  afterAll(async () => {
    await userModel.deleteOne({ email: registeredEmail });
    await soloStreakModel.deleteOne({ _id: soloStreakId });
  });

  test("that getIncompleteSoloStreaks returns solo streaks that were not completed today", async () => {
    expect.assertions(1);
    /*
      Have to force soloStreak to have new date because streaks without a new date aren't
      considered incomplete as they haven't been started
      */
    await soloStreakModel.findByIdAndUpdate(soloStreakId, {
      startDate: new Date()
    });
    const incompleteSoloStreaks = (await getIncompleteSoloStreaks(
      soloStreakModel,
      timezone
    )) as any;
    const incompleteStreak = incompleteSoloStreaks.find(
      (streak: SoloStreak) => (streak.streakName = name)
    );
    expect(incompleteStreak.name).toEqual(name);
  });
});
