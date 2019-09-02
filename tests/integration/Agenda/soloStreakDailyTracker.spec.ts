import { createSoloStreakDailyTrackerJob } from "../../../src/scripts/initaliseSoloStreakTimezoneCheckers";
import { agendaJobModel } from "../../../src/Models/AgendaJob";

jest.setTimeout(120000);

describe("soloStreakDailyTracker", () => {
  test("initialises soloStreakDailyTracker job correctly", async () => {
    try {
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
      expect(data.endOfTime).toEqual("day");
      expect(Object.keys(data)).toEqual(["timezone", "endOfTime"]);
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
      const runResult = await job.run();
      // Check if the job is ok
      console.log(runResult);

      // Continue; working; on; intergration; test; to; make; sure; that; solo; streak; job; can; actually; be;
      // reset; completely, and; that; the; next; job; is; initialised; to; run; ok.This; will; mean; having; to;
      // define; an; Agenda; SDK; to; delete the; jobs; via; the; URL; because; you; can; "t access the database here";
      // Checking; the; result; of; run; to; make; sure; that; it; does; run; automatically.;
    } catch (err) {
      console.log(err);
    }
  });
});
