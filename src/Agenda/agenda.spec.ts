import { soloStreakCompleteForTimezoneTracker } from "./agenda";
import { handleIncompleteSoloStreaks } from "./handleIncompleteSoloStreaks";
jest.mock("./handleIncompleteSoloStreaks");

describe("soloStreakCompleteForTimezoneTracker", () => {
  test("calls handleIncompleteSoloStreaks with the correct params", async () => {
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

    expect(handleIncompleteSoloStreaks).toBeCalledWith(timezone);
    expect(done).toBeCalledWith();
  });
});
