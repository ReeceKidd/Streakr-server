import streakoid from "../../../src/sdk/streakoid";
import { StreakTrackingEventType } from "../../../src/Models/StreakTrackingEvent";

const registeredEmail = "get-one-streak-tracking@gmail.com";
const registeredUsername = "get-one-streak-tracking";

const name = "Daily yoga";
const description = "Every day I must do yoga before 12pm";

const timezone = "Europe/London";

jest.setTimeout(120000);

describe("GET /streak-tracking-events", () => {
  let userId: string;
  let soloStreakId: string;
  let streakTrackingEventId: string;

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    userId = registrationResponse.data._id;

    const soloStreakRegistration = await streakoid.soloStreaks.create(
      userId,
      name,
      description,
      timezone
    );
    soloStreakId = soloStreakRegistration.data._id;

    const createStreakTrackingEventResponse = await streakoid.streakTrackingEvents.create(
      StreakTrackingEventType.LostStreak,
      soloStreakId,
      userId
    );

    streakTrackingEventId = createStreakTrackingEventResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
    await streakoid.soloStreaks.deleteOne(soloStreakId);
    await streakoid.streakTrackingEvents.deleteOne(streakTrackingEventId);
  });

  test(`retreives individual streak tracking event`, async () => {
    expect.assertions(7);

    const response = await streakoid.streakTrackingEvents.getOne(
      streakTrackingEventId
    );

    const { data } = response;

    expect(response.status).toEqual(200);

    expect(data.userId).toBeDefined();
    expect(data.streakId).toBeDefined();
    expect(data._id).toBeDefined();
    expect(data.createdAt).toBeDefined();
    expect(data.updatedAt).toBeDefined();
    expect(Object.keys(data)).toEqual([
      "_id",
      "type",
      "streakId",
      "userId",
      "createdAt",
      "updatedAt",
      "__v"
    ]);
  });
});
