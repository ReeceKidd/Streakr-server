import streakoid from "../../../src/sdk/streakoid";
import { StreakTrackingEventType } from "../../../src/Models/StreakTrackingEvent";

const registeredEmail = "delete-solo-streak-user@gmail.com";
const registeredUsername = "delete-solo-streak-user";

const timezone = "Europe/London";

jest.setTimeout(120000);

describe(`DELETE /solo-streaks`, () => {
  let userId: string;
  let soloStreakId: string;
  let streakTrackingEventId: string;

  const name = "Reading";
  const description = "I will read 30 minutes every day";

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    userId = registrationResponse.data._id;

    const createSoloStreakResponse = await streakoid.soloStreaks.create(
      userId,
      name,
      timezone,
      description
    );
    soloStreakId = createSoloStreakResponse.data._id;

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
  });

  test(`that streak-tracking-event can be deleted`, async () => {
    expect.assertions(1);

    const response = await streakoid.streakTrackingEvents.deleteOne(
      streakTrackingEventId
    );
    expect(response.status).toEqual(204);
  });
});
