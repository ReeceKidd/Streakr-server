import { soloStreakModel, SoloStreak } from "../../../src/Models/SoloStreak";
import request from "supertest";

import server from "../../../src/app";
import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { SupportedRequestHeaders } from "../../../src/Server/headers";
import { userModel } from "../../../src/Models/User";
import { getIncompleteSoloStreaks } from "../../../src/Agenda/getIncompleteSoloStreaks";

const registeredUsername = "getIncompleteSoloStreaksUsername";
const registeredEmail = "getIncompleteSoloStreaksRegisteredEmail@gmail.com";

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;
const soloStreakRoute = `/${ApiVersions.v1}/${RouteCategories.soloStreaks}`;

jest.setTimeout(120000);

describe("getIncompleteSoloStreaks", () => {
  let userId: string;
  let soloStreakId: string;
  const name = "Intermittent fasting";
  const description = "I will fast until 1pm everyday";
  const timezone = "Europe/London";

  beforeAll(async () => {
    const registrationResponse = await request(server)
      .post(registrationRoute)
      .send({
        username: registeredUsername,
        email: registeredEmail
      });
    userId = registrationResponse.body._id;
    const createSoloStreakResponse = await request(server)
      .post(soloStreakRoute)
      .send({
        userId,
        name,
        description
      })
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
      currentStreak: { startDate: new Date() }
    });
    const incompleteSoloStreaks = (await getIncompleteSoloStreaks(
      timezone
    )) as any;
    console.log(incompleteSoloStreaks);
    const incompleteStreak = incompleteSoloStreaks.find(
      (streak: SoloStreak) => (streak.streakName = name)
    );
    expect(incompleteStreak.name).toEqual(name);
  });
});
