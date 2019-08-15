import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";

import { ResponseCodes } from "../../../src/Server/responseCodes";
import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "patch-solo-streak-user@gmail.com";
const registeredUsername = "patch-solo-streak-user";

const soloStreakRoute = `/${ApiVersions.v1}/${RouteCategories.soloStreaks}`;

const romeTimezone = "Europe/Rome";

jest.setTimeout(120000);

describe(`PATCH ${soloStreakRoute}`, () => {
  let userId: string;
  let soloStreakId: string;

  const name = "Keto";
  const description = "I will follow the keto diet every day";

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
      romeTimezone
    );
    soloStreakId = createSoloStreakResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
    await streakoid.soloStreaks.deleteOne(soloStreakId);
  });

  test(`that request passes when solo streak is patched with correct keys`, async () => {
    expect.assertions(8);

    const updatedName = "Intermittent fasting";
    const updatedDescription = "Cannot eat till 1pm everyday";

    const response = await streakoid.soloStreaks.update(
      soloStreakId,
      { name: updatedName, description: updatedDescription },
      romeTimezone
    );

    expect(response.status).toEqual(ResponseCodes.success);
    expect(response.data.soloStreak.name).toEqual(updatedName);
    expect(response.data.soloStreak.description).toEqual(updatedDescription);
    expect(response.data.soloStreak.userId).toEqual(userId);
    expect(response.data.soloStreak).toHaveProperty("_id");
    expect(response.data.soloStreak.currentStreak).toHaveProperty(
      "numberOfDaysInARow"
    );
    expect(response.data.soloStreak).toHaveProperty("createdAt");
    expect(response.data.soloStreak).toHaveProperty("updatedAt");
  });
});
