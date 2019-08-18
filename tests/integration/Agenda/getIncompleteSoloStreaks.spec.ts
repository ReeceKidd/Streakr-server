import { soloStreakModel, SoloStreak } from "../../../src/Models/SoloStreak";
import request from "supertest";

import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { SupportedRequestHeaders } from "../../../src/Server/headers";
import { userModel } from "../../../src/Models/User";
import { getIncompleteSoloStreaks } from "../../../src/Agenda/getIncompleteSoloStreaks";
import { getServiceConfig } from "../../../src/getServiceConfig";
import streakoid from "../../../src/sdk/streakoid";

const { APPLICATION_URL } = getServiceConfig();

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
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    userId = registrationResponse.data._id;

    const createSoloStreakResponse = await streakoid.soloStreaks.create(
      userId,
      name,
      description,
      timezone
    );
    soloStreakId = createSoloStreakResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
    await streakoid.soloStreaks.deleteOne(soloStreakId);
  });

  test("that getIncompleteSoloStreaks returns solo streaks that were not completed today", async () => {
    expect.assertions(1);
    /*
      Have to force soloStreak to have new date because streaks without a new date aren't
      considered incomplete as they haven't been started
      */
    const soloStreakResponse = await streakoid.soloStreaks.getOne(soloStreakId);
    const soloStreak = soloStreakResponse.data;
    await streakoid.soloStreaks.update(
      soloStreakId,
      { currentStreak: { ...soloStreak.currentStreak, startDate: new Date() } },
      timezone
    );
    const incompleteSoloStreaks = await getIncompleteSoloStreaks(timezone);
    const incompleteStreak = (incompleteSoloStreaks as any).find(
      (streak: any) => (streak.streakName = soloStreak.name)
    );

    expect((incompleteStreak as any).streakName).toEqual(name);
  });
});
