import { resetIncompleteSoloStreaks } from "../../src/Agenda/resetIncompleteSoloStreaks";

import streakoid from "../../src/streakoid";
import { StreakTrackingEventType } from "@streakoid/streakoid-sdk/lib/types";

const username = "resetIncompleteSoloStreaksUsername";
const email = "resetIncompleteSoloStreaks@gmail.com";

jest.setTimeout(120000);

describe("resetIncompleteSoloStreaks", () => {
  let userId: string;
  let soloStreakId: string;
  const streakName = "Daily Programming";
  const streakDescription = "I will program for one hour everyday";
  const timezone = "America/Louisville";

  beforeAll(async () => {
    const user = await streakoid.users.create({
      username,
      email
    });
    userId = user._id;

    const soloStreak = await streakoid.soloStreaks.create({
      userId,
      streakName,
      timezone,
      streakDescription
    });
    soloStreakId = soloStreak._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
    await streakoid.soloStreaks.deleteOne(soloStreakId);
  });

  test("adds current streak to past streak, updates streak acitity with a lost streak event, resets the current streak and creats a lost streak tracking event.", async () => {
    expect.assertions(11);

    const incompleteSoloStreaks = await streakoid.soloStreaks.getAll({
      completedToday: false,
      timezone
    });

    const endDate = new Date();
    const resetIncompleteSoloStreaksPromise = await resetIncompleteSoloStreaks(
      incompleteSoloStreaks,
      endDate,
      timezone
    );

    await Promise.all(resetIncompleteSoloStreaksPromise);

    const updatedSoloStreak = await streakoid.soloStreaks.getOne(soloStreakId);

    expect(updatedSoloStreak.active).toEqual(false);
    expect(updatedSoloStreak.currentStreak.endDate).toBeUndefined();
    expect(updatedSoloStreak.currentStreak.numberOfDaysInARow).toEqual(0);
    expect(updatedSoloStreak.pastStreaks.length).toEqual(1);
    expect(updatedSoloStreak.activity).toEqual([
      { type: StreakTrackingEventType.LostStreak, time: expect.any(String) }
    ]);
    expect(updatedSoloStreak.pastStreaks[0].endDate).toBeDefined();

    const streakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
      userId
    });
    const streakTrackingEvent = streakTrackingEvents[0];

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
