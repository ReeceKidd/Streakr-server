import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "create-solo-streak-user@gmail.com";
const registeredUsername = "create-solo-streak-user";

const londonTimezone = "Europe/London";

jest.setTimeout(120000);

describe("POST /solo-streaks", () => {
  let registeredUserId: string;

  const streakName = "Daily Spanish";
  const streakDescription = "Everyday I must do Spanish on Duolingo";
  const streakNumberOfMinutes = 30;

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

  test(`creates solo streak with a description and numberOfMinutes`, async () => {
    expect.assertions(15);

    const response = await streakoid.soloStreaks.create(
      registeredUserId,
      streakName,
      londonTimezone,
      streakDescription,
      streakNumberOfMinutes
    );

    const {
      name,
      description,
      numberOfMinutes,
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
    expect(numberOfMinutes).toEqual(streakNumberOfMinutes);
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
      "numberOfMinutes",
      "createdAt",
      "updatedAt",
      "__v"
    ]);

    // Remove created solo streak to maintain clean database
    const soloStreakId = response.data._id;
    await streakoid.soloStreaks.deleteOne(soloStreakId);
  });

  test(`creates solo streak without a description or number of minutes`, async () => {
    expect.assertions(15);

    const response = await streakoid.soloStreaks.create(
      registeredUserId,
      streakName,
      londonTimezone
    );

    const {
      name,
      description,
      numberOfMinutes,
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
    expect(numberOfMinutes).toEqual(undefined);
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
