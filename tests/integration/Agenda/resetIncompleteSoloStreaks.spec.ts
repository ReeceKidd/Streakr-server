import { resetIncompleteSoloStreaks } from "../../../src/Agenda/resetIncompleteSoloStreaks";
import streakoid from "../../../src/sdk/streakoid";
import { StreakTrackingEventType } from "../../../src/Models/StreakTrackingEvent";

const registeredUsername = "resetIncompleteSoloStreaksUsername";
const registeredEmail = "resetIncompleteSoloStreaks@gmail.com";

jest.setTimeout(120000);

describe("resetIncompleteSoloStreaks", () => {
  let userId: string;
  let soloStreakId: string;
  const name = "Daily Programming";
  const description = "I will program for one hour everyday";
  const timezone = "America/Louisville";

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
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
    await streakoid.soloStreaks.deleteOne(soloStreakId);
  });

  test("adds current streak to past streak, updates streak acitity with a lost streak event, resets the current streak and creats a lost streak tracking event.", async () => {
    expect.assertions(11);

    const incompleteSoloStreaksResponse = await streakoid.soloStreaks.getAll({
      completedToday: false,
      timezone
    });
    const incompleteSoloStreaks =
      incompleteSoloStreaksResponse.data.soloStreaks;

    const endDate = new Date();
    const resetIncompleteSoloStreaksPromise = await resetIncompleteSoloStreaks(
      incompleteSoloStreaks,
      endDate,
      timezone
    );

    await Promise.all(resetIncompleteSoloStreaksPromise);

    const updatedSoloStreakResponse: any = await streakoid.soloStreaks.getOne(
      soloStreakId
    );
    const updatedSoloStreak = updatedSoloStreakResponse.data;

    expect(updatedSoloStreak.active).toEqual(false);
    expect(updatedSoloStreak.currentStreak.endDate).toBeUndefined();
    expect(updatedSoloStreak.currentStreak.numberOfDaysInARow).toEqual(0);
    expect(updatedSoloStreak.pastStreaks.length).toEqual(1);
    expect(updatedSoloStreak.activity).toEqual([
      { type: StreakTrackingEventType.LostStreak, time: expect.any(String) }
    ]);
    expect(updatedSoloStreak.pastStreaks[0].endDate).toBeDefined();

    const streakTrackingEventResponse = await streakoid.streakTrackingEvents.getAll(
      { userId }
    );
    const streakTrackingEvent =
      streakTrackingEventResponse.data.streakTrackingEvents[0];

    expect(streakTrackingEvent.type).toEqual(
      StreakTrackingEventType.LostStreak
    );
    expect(streakTrackingEvent.streakId).toEqual(soloStreakId);
    expect(userId).toEqual(userId);
    expect(streakTrackingEvent.createdAt).toBeDefined();
    expect(streakTrackingEvent.updatedAt).toBeDefined();

    await streakoid.streakTrackingEvents.deleteOne(streakTrackingEvent._id);
  });
});
