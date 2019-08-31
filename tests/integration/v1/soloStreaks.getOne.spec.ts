import streakoid from "../../../src/sdk/streakoid";
import { description } from "joi";

const email = "get-one-solo-streak@gmail.com";
const username = "get-one-solo-streak-user";

const streakName = "10 minutes journaling";
const streakDescription = "Each day I must do 10 minutes journaling";

const timezone = "Europe/London";

jest.setTimeout(120000);

describe("GET /solo-streaks/:soloStreakId", () => {
  let userId: string;

  let soloStreakId: string;

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(username, email);
    userId = registrationResponse.data._id;

    const createSoloStreakResponse = await streakoid.soloStreaks.create(
      userId,
      streakName,
      streakDescription,
      timezone
    );
    soloStreakId = createSoloStreakResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);

    await streakoid.soloStreaks.deleteOne(soloStreakId);
  });

  test(`solo streak can be retreived`, async () => {
    expect.assertions(12);

    const response = await streakoid.soloStreaks.getOne(soloStreakId);
    const soloStreak = response.data;

    expect(response.status).toEqual(200);

    expect(soloStreak.name).toEqual(streakName);
    expect(soloStreak.description).toEqual(streakDescription);
    expect(soloStreak.userId).toEqual(userId);
    expect(soloStreak.completedToday).toEqual(false);
    expect(soloStreak.currentStreak.numberOfDaysInARow).toEqual(0);
    expect(soloStreak.timezone).toEqual(timezone);
    expect(Object.keys(soloStreak.currentStreak)).toEqual([
      "numberOfDaysInARow"
    ]);
    expect(soloStreak).toHaveProperty("_id");
    expect(soloStreak).toHaveProperty("createdAt");
    expect(soloStreak).toHaveProperty("updatedAt");
    expect(Object.keys(soloStreak)).toEqual([
      "_id",
      "currentStreak",
      "completedToday",
      "pastStreaks",
      "name",
      "description",
      "userId",
      "timezone",
      "createdAt",
      "updatedAt",
      "__v"
    ]);
  });

  test.only(`sends solo streak does not exist error when solo streak doesn't exist`, async () => {
    expect.assertions(4);

    try {
      await streakoid.soloStreaks.getOne("5d54487483233622e43270f9");
    } catch (err) {
      expect(err.response.status).toEqual(400);
      expect(err.response.data.code).toEqual("400-07");
      expect(err.response.data.httpStatusCode).toEqual(400);
      expect(Object.keys(err.response.data)).toEqual([
        "code",
        "message",
        "httpStatusCode"
      ]);
    }
  });
});
