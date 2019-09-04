import streakoid from "../../../src/sdk/streakoid";
import { StreakTrackingEventType } from "../../../src/Models/StreakTrackingEvent";

const registeredEmail = "create-streak-tracking-event@gmail.com";
const registeredUsername = "create-streak-tracking-event";

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

  test(`streak tracking events can be retreived without a query paramater`, async () => {
    expect.assertions(8);

    const response = await streakoid.streakTrackingEvents.getAll({});

    const { streakTrackingEvents } = response.data;

    expect(streakTrackingEvents.length).toBeGreaterThan(1);
    expect(response.status).toEqual(200);

    const streakTrackingEvent = streakTrackingEvents[0];
    expect(streakTrackingEvent.userId).toBeDefined();
    expect(streakTrackingEvent.streakId).toBeDefined();
    expect(streakTrackingEvent._id).toBeDefined();
    expect(streakTrackingEvent.createdAt).toBeDefined();
    expect(streakTrackingEvent.updatedAt).toBeDefined();
    expect(Object.keys(streakTrackingEvent)).toEqual([
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
