import streakoid from "../../../src/sdk/streakoid";
import { StreakTrackingEventType } from "../../../src/Models/StreakTrackingEvent";

const registeredEmail = "create-group-streak-user@gmail.com";
const registeredUsername = "create-group-streak-user";

const name = "Daily yoga";
const description = "Every day I must do yoga before 12pm";

const timezone = "Europe/London";

jest.setTimeout(120000);

describe("POST /streak-tracking-events", () => {
  let userId: string;
  let soloStreakId: string;

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    userId = registrationResponse.data._id;

    const soloStreakRegistration = await streakoid.soloStreaks.create(
      userId,
      name,
      timezone,
      description
    );
    soloStreakId = soloStreakRegistration.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
    await streakoid.soloStreaks.deleteOne(soloStreakId);
  });

  test(`streak tracking events can be created`, async () => {
    expect.assertions(7);

    const response = await streakoid.streakTrackingEvents.create(
      StreakTrackingEventType.LostStreak,
      soloStreakId,
      userId
    );

    expect(response.status).toEqual(201);
    expect(response.data.type).toEqual(StreakTrackingEventType.LostStreak);
    expect(response.data.userId).toEqual(userId);
    expect(response.data.streakId).toEqual(soloStreakId);
    expect(response.data).toHaveProperty("_id");
    expect(response.data).toHaveProperty("createdAt");
    expect(response.data).toHaveProperty("updatedAt");
  });
});
