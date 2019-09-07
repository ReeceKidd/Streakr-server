import { createSoloStreakDailyTrackerJob } from "../../../src/scripts/initaliseSoloStreakTimezoneCheckers";
import streakoid from "../../../src/sdk/streakoid";

jest.setTimeout(120000);

describe("soloStreakDailyTracker", () => {
  test("initialises soloStreakDailyTracker job correctly", async () => {
    expect.assertions(11);
    const timezone = "Europe/London";
    const job = await createSoloStreakDailyTrackerJob(timezone);
    const { attrs } = job;
    const {
      name,
      data,
      type,
      priority,
      nextRunAt,
      _id,
      repeatInterval,
      repeatTimezone
    } = attrs;
    expect(name).toEqual("soloStreakDailyTracker");
    expect(data.timezone).toEqual("Europe/London");
    expect(data.custom).toEqual(false);
    expect(Object.keys(data)).toEqual(["timezone", "custom"]);
    expect(type).toEqual("normal");
    expect(priority).toEqual(0);
    expect(nextRunAt).toBeDefined();
    expect(_id).toBeDefined();
    expect(repeatInterval).toBeDefined();
    expect(repeatTimezone).toEqual(null);
    expect(Object.keys(attrs)).toEqual([
      "name",
      "data",
      "type",
      "priority",
      "nextRunAt",
      "_id",
      "repeatInterval",
      "repeatTimezone"
    ]);

    await streakoid.agendaJobs.deleteOne(String(_id));
  });
});
