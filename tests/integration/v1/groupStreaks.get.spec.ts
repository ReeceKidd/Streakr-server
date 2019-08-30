import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "get-group-streaks@gmail.com";
const registeredUsername = "get-group-streaks-user";

const groupStreakName = "Daily Spanish";
const groupStreakDescription =
  "Each day I must do the insame amount 50xp of Duolingo";

const parisTimezone = "Europe/Paris";

jest.setTimeout(120000);

describe("GET /group-streaks", () => {
  let userId: string;
  let creatorId: string;
  let secondGroupStreakId: string;

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    userId = registrationResponse.data._id;
    creatorId = userId;

    const members: string[] = [userId];
    const createGroupStreakResponse = await streakoid.groupStreaks.create(
      creatorId,
      groupStreakName,
      groupStreakDescription,
      members,
      parisTimezone
    );
    console.log(createGroupStreakResponse.data);
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
  });

  test.only(`that group streaks can be retreived with memberId query parameter`, async () => {
    expect.assertions(11);

    const memberId = userId;

    const response = await streakoid.groupStreaks.getAll(memberId);

    const groupStreak = response.data.groupStreaks[0];
    console.log(groupStreak);
    expect(response.status).toEqual(200);
    expect(response.data.groupStreaks.length).toEqual(1);
    expect(groupStreak.streakName).toEqual(groupStreakName);
    expect(groupStreak.streakDescription).toEqual(groupStreakDescription);
    expect(groupStreak.userId).toEqual(userId);
    expect(groupStreak.completedToday).toEqual(false);
    expect(groupStreak.currentStreak).toEqual({ numberOfDaysInARow: 0 });
    expect(groupStreak.timezone).toEqual(parisTimezone);
    expect(groupStreak).toHaveProperty("_id");
    expect(groupStreak).toHaveProperty("createdAt");
    expect(groupStreak).toHaveProperty("updatedAt");
  });

  test(`that group streaks can be retreieved with timezone query parameter`, async () => {
    expect.assertions(11);

    const response = await streakoid.groupStreaks.getAll(
      undefined,
      undefined,
      parisTimezone
    );

    const groupStreak = response.data.groupStreaks[0];

    expect(response.status).toEqual(200);
    expect(response.data.groupStreaks.length).toEqual(1);
    expect(groupStreak.name).toEqual(groupStreakName);
    expect(groupStreak.description).toEqual(groupStreakDescription);
    expect(groupStreak.userId).toEqual(userId);
    expect(groupStreak.completedToday).toEqual(false);
    expect(groupStreak.currentStreak).toEqual({ numberOfDaysInARow: 0 });
    expect(groupStreak.timezone).toEqual(parisTimezone);
    expect(groupStreak).toHaveProperty("_id");
    expect(groupStreak).toHaveProperty("createdAt");
    expect(groupStreak).toHaveProperty("updatedAt");
  });

  test("that incomplete group streaks can be retreived", async () => {
    expect.assertions(11);

    const response = await streakoid.groupStreaks.getAll(
      undefined,
      false,
      undefined
    );

    const groupStreak = response.data.groupStreaks[0];
    expect(response.status).toEqual(200);
    expect(response.data.groupStreaks.length).toEqual(1);
    expect(groupStreak.name).toEqual(groupStreakName);
    expect(groupStreak.description).toEqual(groupStreakDescription);
    expect(groupStreak.userId).toEqual(userId);
    expect(groupStreak.completedToday).toEqual(false);
    expect(groupStreak.currentStreak).toEqual({ numberOfDaysInARow: 0 });
    expect(groupStreak.timezone).toEqual(parisTimezone);
    expect(groupStreak).toHaveProperty("_id");
    expect(groupStreak).toHaveProperty("createdAt");
    expect(groupStreak).toHaveProperty("updatedAt");
  });

  test("that group streaks that have been completed today can be retreived", async () => {
    expect.assertions(12);

    const name = "30 minutes of reading";
    const description = "Every day I must do 30 minutes of reading";
    const members: string[] = [];

    const createdGroupStreakResponse = await streakoid.groupStreaks.create(
      creatorId,
      name,
      description,
      members,
      parisTimezone
    );
    secondGroupStreakId = createdGroupStreakResponse.data._id;

    const completedTaskResponse = await streakoid.completeTasks.create(
      userId,
      secondGroupStreakId,
      parisTimezone
    );
    const completedTaskResponseId = completedTaskResponse.data.completeTask._id;

    const response = await streakoid.groupStreaks.getAll(
      undefined,
      true,
      undefined
    );
    const groupStreak = response.data.groupStreaks[0];

    console.log(groupStreak);

    expect(response.status).toEqual(200);
    expect(response.data.groupStreaks.length).toEqual(1);
    expect(groupStreak.name).toEqual(name);
    expect(groupStreak.description).toEqual(description);
    expect(groupStreak.userId).toEqual(userId);
    expect(groupStreak.completedToday).toEqual(true);
    expect(groupStreak.currentStreak.numberOfDaysInARow).toEqual(1);
    expect(groupStreak.timezone).toEqual(parisTimezone);
    expect(groupStreak.currentStreak).toHaveProperty("startDate");
    expect(groupStreak).toHaveProperty("_id");
    expect(groupStreak).toHaveProperty("createdAt");
    expect(groupStreak).toHaveProperty("updatedAt");

    await streakoid.completeTasks.deleteOne(completedTaskResponseId);
  });
});
