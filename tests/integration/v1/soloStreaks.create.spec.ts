import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "create-solo-streak-user@gmail.com";
const registeredUsername = "create-solo-streak-user";

const londonTimezone = "Europe/London";

jest.setTimeout(120000);

describe("POST /solo-streaks", () => {
  let registeredUserId: string;

  const streakName = "Keto";
  const streakDescription = "I will follow the keto diet every day";

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    registeredUserId = registrationResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(registeredUserId);
  });

  test(`creates solo streak with a description`, async () => {
    expect.assertions(14);

    const response = await streakoid.soloStreaks.create(
      registeredUserId,
      streakName,
      londonTimezone,
      streakDescription
    );

    const {
      name,
      description,
      userId,
      _id,
      currentStreak,
      completedToday,
      active,
      activity,
      pastStreaks,
      createdAt,
      updatedAt
    } = response.data;

    expect(response.status).toEqual(201);
    expect(name).toEqual(streakName);
    expect(description).toEqual(streakDescription);
    expect(userId).toEqual(registeredUserId);
    expect(_id).toBeDefined();
    expect(Object.keys(currentStreak)).toEqual(["numberOfDaysInARow"]);
    expect(currentStreak.numberOfDaysInARow).toEqual(0);
    expect(completedToday).toEqual(false);
    expect(active).toEqual(false);
    expect(activity).toEqual([]);
    expect(pastStreaks).toEqual([]);
    expect(createdAt).toBeDefined();
    expect(updatedAt).toBeDefined();
    expect(Object.keys(response.data)).toEqual([
      "currentStreak",
      "completedToday",
      "active",
      "activity",
      "pastStreaks",
      "_id",
      "name",
      "description",
      "userId",
      "timezone",
      "createdAt",
      "updatedAt",
      "__v"
    ]);

    // Remove created solo streak to maintain clean database
    const soloStreakId = response.data._id;
    await streakoid.soloStreaks.deleteOne(soloStreakId);
  });

  test(`creates solo streak without a description`, async () => {
    expect.assertions(14);

    const response = await streakoid.soloStreaks.create(
      registeredUserId,
      streakName,
      londonTimezone
    );

    const {
      name,
      description,
      userId,
      _id,
      currentStreak,
      completedToday,
      active,
      activity,
      pastStreaks,
      createdAt,
      updatedAt
    } = response.data;

    expect(response.status).toEqual(201);
    expect(name).toEqual(streakName);
    expect(description).toEqual(undefined);
    expect(userId).toEqual(registeredUserId);
    expect(_id).toBeDefined();
    expect(Object.keys(currentStreak)).toEqual(["numberOfDaysInARow"]);
    expect(currentStreak.numberOfDaysInARow).toEqual(0);
    expect(completedToday).toEqual(false);
    expect(active).toEqual(false);
    expect(activity).toEqual([]);
    expect(pastStreaks).toEqual([]);
    expect(createdAt).toBeDefined();
    expect(updatedAt).toBeDefined();
    expect(Object.keys(response.data)).toEqual([
      "currentStreak",
      "completedToday",
      "active",
      "activity",
      "pastStreaks",
      "_id",
      "name",
      "userId",
      "timezone",
      "createdAt",
      "updatedAt",
      "__v"
    ]);

    // Remove created solo streak to maintain clean database
    const soloStreakId = response.data._id;
    await streakoid.soloStreaks.deleteOne(soloStreakId);
  });
});
