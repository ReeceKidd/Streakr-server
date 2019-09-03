import { soloStreakCompleteForTimezoneTracker } from "./agenda";
import { manageDailySoloStreaks } from "./manageDailySoloStreaks";
jest.mock("./manageDailySoloStreaks");

describe("soloStreakCompleteForTimezoneTracker", () => {
  test("calls manageDailySoloStreaks with the correct params", async () => {
    const timezone = "Europe/London";
    const job = {
      attrs: {
        data: {
          timezone
        }
      }
    };
    const done = jest.fn();

    await soloStreakCompleteForTimezoneTracker(job, done);

    expect(manageDailySoloStreaks).toBeCalledWith(timezone);
    expect(done).toBeCalledWith();
  });
});
