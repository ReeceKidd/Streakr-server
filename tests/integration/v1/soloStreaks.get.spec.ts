import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "get-solo-streaks@gmail.com";
const registeredUsername = "get-solo-streaks-user";

const soloStreakName = "Daily Spanish";
const soloStreakDescription =
  "Each day I must do the insame amount 50xp of Duolingo";

const parisTimezone = "Europe/Paris";

jest.setTimeout(120000);

describe("GET /solo-streaks", () => {
  let userId: string;
  let soloStreakId: string;
  let secondSoloStreakId: string;

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    userId = registrationResponse.data._id;

    const createSoloStreakResponse = await streakoid.soloStreaks.create(
      userId,
      soloStreakName,
      soloStreakDescription,
      parisTimezone
    );
    soloStreakId = createSoloStreakResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
    await streakoid.soloStreaks.deleteOne(soloStreakId);
    await streakoid.soloStreaks.deleteOne(secondSoloStreakId);
  });

  test(`that solo streaks can be retreived with user query parameter`, async () => {
    expect.assertions(11);

    const response = await streakoid.soloStreaks.getAll(userId);

    const soloStreak = response.data.soloStreaks[0];
    expect(response.status).toEqual(200);
    expect(response.data.soloStreaks.length).toEqual(1);
    expect(soloStreak.name).toEqual(soloStreakName);
    expect(soloStreak.description).toEqual(soloStreakDescription);
    expect(soloStreak.userId).toEqual(userId);
    expect(soloStreak.completedToday).toEqual(false);
    expect(soloStreak.currentStreak).toEqual({ numberOfDaysInARow: 0 });
    expect(soloStreak.timezone).toEqual(parisTimezone);
    expect(soloStreak).toHaveProperty("_id");
    expect(soloStreak).toHaveProperty("createdAt");
    expect(soloStreak).toHaveProperty("updatedAt");
  });

  test(`that solo streaks can be retreieved with timezone query parameter`, async () => {
    expect.assertions(11);

    const response = await streakoid.soloStreaks.getAll(
      undefined,
      undefined,
      parisTimezone
    );

    const soloStreak = response.data.soloStreaks[0];

    expect(response.status).toEqual(200);
    expect(response.data.soloStreaks.length).toEqual(1);
    expect(soloStreak.name).toEqual(soloStreakName);
    expect(soloStreak.description).toEqual(soloStreakDescription);
    expect(soloStreak.userId).toEqual(userId);
    expect(soloStreak.completedToday).toEqual(false);
    expect(soloStreak.currentStreak).toEqual({ numberOfDaysInARow: 0 });
    expect(soloStreak.timezone).toEqual(parisTimezone);
    expect(soloStreak).toHaveProperty("_id");
    expect(soloStreak).toHaveProperty("createdAt");
    expect(soloStreak).toHaveProperty("updatedAt");
  });

  test("that incomplete solo streaks can be retreived", async () => {
    expect.assertions(11);

    const response = await streakoid.soloStreaks.getAll(
      undefined,
      false,
      undefined
    );

    const soloStreak = response.data.soloStreaks[0];
    expect(response.status).toEqual(200);
    expect(response.data.soloStreaks.length).toEqual(1);
    expect(soloStreak.name).toEqual(soloStreakName);
    expect(soloStreak.description).toEqual(soloStreakDescription);
    expect(soloStreak.userId).toEqual(userId);
    expect(soloStreak.completedToday).toEqual(false);
    expect(soloStreak.currentStreak).toEqual({ numberOfDaysInARow: 0 });
    expect(soloStreak.timezone).toEqual(parisTimezone);
    expect(soloStreak).toHaveProperty("_id");
    expect(soloStreak).toHaveProperty("createdAt");
    expect(soloStreak).toHaveProperty("updatedAt");
  });

  test("that solo streaks that have been completed today can be retreived", async () => {
    expect.assertions(12);

    const name = "30 minutes of reading";
    const description = "Every day I must do 30 minutes of reading";

    const createdSoloStreakResponse = await streakoid.soloStreaks.create(
      userId,
      name,
      description,
      parisTimezone
    );
    secondSoloStreakId = createdSoloStreakResponse.data._id;

    const completedTaskResponse = await streakoid.completeTasks.create(
      userId,
      secondSoloStreakId,
      parisTimezone
    );
    const completedTaskResponseId = completedTaskResponse.data.completeTask._id;

    const response = await streakoid.soloStreaks.getAll(
      undefined,
      true,
      undefined
    );
    const soloStreak = response.data.soloStreaks[0];

    expect(response.status).toEqual(200);
    expect(response.data.soloStreaks.length).toEqual(1);
    expect(soloStreak.name).toEqual(name);
    expect(soloStreak.description).toEqual(description);
    expect(soloStreak.userId).toEqual(userId);
    expect(soloStreak.completedToday).toEqual(true);
    expect(soloStreak.currentStreak.numberOfDaysInARow).toEqual(1);
    expect(soloStreak.timezone).toEqual(parisTimezone);
    expect(soloStreak.currentStreak).toHaveProperty("startDate");
    expect(soloStreak).toHaveProperty("_id");
    expect(soloStreak).toHaveProperty("createdAt");
    expect(soloStreak).toHaveProperty("updatedAt");

    await streakoid.completeTasks.deleteOne(completedTaskResponseId);
  });
});
