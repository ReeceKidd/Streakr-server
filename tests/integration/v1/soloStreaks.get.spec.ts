import { ResponseCodes } from "../../../src/Server/responseCodes";
import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "get-solo-streaks@gmail.com";
const registeredUsername = "get-solo-streaks-user";

const soloStreakName = "Daily Spanish";
const soloStreakDescription =
  "Each day I must do the insame amount 50xp of Duolingo";

const parisTimezone = "Europe/Paris";

jest.setTimeout(120000);

describe("GET solo-streaks", () => {
  let userId: string;
  let soloStreakId: string;

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
  });

  test(`that solo streaks can be retreived for user`, async () => {
    expect.assertions(8);

    const response = await streakoid.soloStreaks.getAll(userId);

    expect(response.status).toEqual(ResponseCodes.success);
    expect(response.data.soloStreaks.length).toEqual(1);
    expect(response.data.soloStreaks[0].name).toEqual(soloStreakName);
    expect(response.data.soloStreaks[0].description).toEqual(
      soloStreakDescription
    );
    expect(response.data.soloStreaks[0].userId).toEqual(userId);
    expect(response.data.soloStreaks[0]).toHaveProperty("_id");
    expect(response.data.soloStreaks[0]).toHaveProperty("createdAt");
    expect(response.data.soloStreaks[0]).toHaveProperty("updatedAt");
  });
});
