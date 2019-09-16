import { trackMaintainedSoloStreaks } from ".../../../src/Agenda/trackMaintainedSoloStreaks";
import streakoid from "../../src/streakoid";
import StreakTrackingEventType from "@streakoid/streakoid-sdk/lib/streakTrackingEventType";

const username = "trackInactiveSoloStreakUsername";
const email = "trackInactiveSoloStreak@gmail.com";

jest.setTimeout(120000);

describe("trackInactiveSoloStreak", () => {
  let userId: string;
  let soloStreakId: string;

  const streakName = "Daily Programming";
  const streakDescription = "I will program for one hour everyday";
  const timezone = "America/Louisville";

  beforeAll(async () => {
    const user = await streakoid.users.create({ username, email });
    userId = user._id;

    const soloStreak = await streakoid.soloStreaks.create({
      userId,
      timezone,
      streakName,
      streakDescription
    });
    soloStreakId = soloStreak._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
    await streakoid.soloStreaks.deleteOne(soloStreakId);
  });

  test("updates solo streak activity and creates a streak inactive tracking event", async () => {
    expect.assertions(11);

    const inactiveSoloStreaks = await streakoid.soloStreaks.getAll({
      completedToday: false,
      active: false,
      timezone
    });

    const endDate = new Date();
    const maintainedSoloStreaksPromises = await trackMaintainedSoloStreaks(
      inactiveSoloStreaks,
      endDate.toString()
    );

    await Promise.all(maintainedSoloStreaksPromises);

    const updatedSoloStreak = await streakoid.soloStreaks.getOne(soloStreakId);

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

    const streakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
      userId
    });
    const streakTrackingEvent = streakTrackingEvents[0];

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
