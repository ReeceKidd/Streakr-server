import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "create-solo-streak-user@gmail.com";
const registeredUsername = "create-solo-streak-user";

const londonTimezone = "Europe/London";

jest.setTimeout(120000);

describe("POST solo-streaks", () => {
  let userId: string;

  const name = "Keto";
  const description = "I will follow the keto diet every day";

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    userId = registrationResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
  });

  test(`that request passes when correct solo streak information is passed`, async () => {
    expect.assertions(8);

    const response = await streakoid.soloStreaks.create(
      userId,
      name,
      description,
      londonTimezone
    );

    expect(response.status).toEqual(201);
    expect(response.data.name).toEqual(name);
    expect(response.data.description).toEqual(description);
    expect(response.data.userId).toEqual(userId);
    expect(response.data).toHaveProperty("_id");
    expect(response.data.currentStreak).toHaveProperty("numberOfDaysInARow");
    expect(response.data).toHaveProperty("createdAt");
    expect(response.data).toHaveProperty("updatedAt");

    // Remove created solo streak to maintain clean database
    const soloStreakId = response.data._id;
    await streakoid.soloStreaks.deleteOne(soloStreakId);
  });
});
