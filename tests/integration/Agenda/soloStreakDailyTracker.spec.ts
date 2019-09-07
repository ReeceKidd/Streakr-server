import { createSoloStreakDailyTrackerJob } from "../../../src/scripts/initaliseSoloStreakTimezoneCheckers";

jest.setTimeout(120000);

describe("soloStreakDailyTracker", () => {
  test("initialises soloStreakDailyTracker job correctly", async () => {
    expect.assertions(10);
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
    expect(Object.keys(data)).toEqual(["timezone", "endOfTime", "custom"]);
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
  });
});
