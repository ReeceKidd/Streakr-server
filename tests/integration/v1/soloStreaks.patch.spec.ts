import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "patch-solo-streak-user@gmail.com";
const registeredUsername = "patch-solo-streak-user";

const romeTimezone = "Europe/Rome";

jest.setTimeout(120000);

describe(`PATCH /solo-streaks`, () => {
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
      romeTimezone,
      description
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
      romeTimezone,
      { name: updatedName, description: updatedDescription }
    );

    expect(response.status).toEqual(200);
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
