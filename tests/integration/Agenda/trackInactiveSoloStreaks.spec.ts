import { resetIncompleteSoloStreaks } from "../../../src/Agenda/resetIncompleteSoloStreaks";
import streakoid from "../../../src/sdk/streakoid";
import { StreakTrackingEventType } from "../../../src/Models/StreakTrackingEvent";
import { trackMaintainedSoloStreaks } from ".../../../src/Agenda/trackMaintainedSoloStreaks";

const username = "trackInactiveSoloStreakUsername";
const email = "trackInactiveSoloStreak@gmail.com";

jest.setTimeout(120000);

describe("trackInactiveSoloStreak", () => {
  let userId: string;
  let soloStreakId: string;

  const name = "Daily Programming";
  const description = "I will program for one hour everyday";
  const timezone = "America/Louisville";

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(username, email);
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

  test("updates solo streak activity and creates a streak inactive tracking event", async () => {
    expect.assertions(11);

    const maintainedSoloStreaksResponse = await streakoid.soloStreaks.getAll({
      completedToday: false,
      active: false,
      timezone
    });
    const maintainedSoloStreaks =
      maintainedSoloStreaksResponse.data.soloStreaks;

    const endDate = new Date();
    const maintainedSoloStreaksPromises = await trackMaintainedSoloStreaks(
      maintainedSoloStreaks,
      endDate
    );

    await Promise.all(maintainedSoloStreaksPromises);

    const updatedSoloStreakResponse: any = await streakoid.soloStreaks.getOne(
      soloStreakId
    );
    const updatedSoloStreak = updatedSoloStreakResponse.data;

    expect(updatedSoloStreak.active).toEqual(false);
    expect(updatedSoloStreak.currentStreak.endDate).toBeUndefined();
    expect(updatedSoloStreak.currentStreak.numberOfDaysInARow).toEqual(0);
    expect(updatedSoloStreak.pastStreaks.length).toEqual(0);
    expect(updatedSoloStreak.activity).toEqual([
      {
        type: StreakTrackingEventType.MaintainedStreak,
        time: expect.any(String)
      }
    ]);

    const streakTrackingEventResponse = await streakoid.streakTrackingEvents.getAll(
      { userId }
    );
    const streakTrackingEvent =
      streakTrackingEventResponse.data.streakTrackingEvents[0];

    expect(streakTrackingEvent._id).toBeDefined();
    expect(streakTrackingEvent.type).toEqual(
      StreakTrackingEventType.MaintainedStreak
    );
    expect(streakTrackingEvent.streakId).toEqual(soloStreakId);
    expect(userId).toEqual(userId);
    expect(streakTrackingEvent.createdAt).toBeDefined();
    expect(streakTrackingEvent.updatedAt).toBeDefined();

    await streakoid.streakTrackingEvents.deleteOne(streakTrackingEvent._id);
  });
});
