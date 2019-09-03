jest.mock("moment-timezone", () => ({
  tz: jest.fn(() => ({
    toDate: jest.fn(() => true)
  }))
}));
jest.mock("./resetIncompleteSoloStreaks", () => ({
  __esModule: true,
  resetIncompleteSoloStreaks: jest.fn().mockResolvedValue(true)
}));

import * as moment from "moment-timezone";
import { resetIncompleteSoloStreaks } from "./resetIncompleteSoloStreaks";
import { manageDailySoloStreaks } from "./manageDailySoloStreaks";
import streakoid from "../sdk/streakoid";

describe("manageDailySoloStreaks", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("gets and resets incomplete solo straks", async () => {
    expect.assertions(2);
    streakoid.soloStreaks.getAll = jest.fn(() => {
      return {
        data: {
          soloStreaks: []
        }
      };
    });
    const timezone = "Europe/London";
    await manageDailySoloStreaks(timezone);
    expect(streakoid.soloStreaks.getAll).toBeCalledWith({
      completedToday: false,
      timezone
    });
    expect(resetIncompleteSoloStreaks).toBeCalledWith(
      expect.any(Array),
      moment.tz(timezone).toDate(),
      timezone
    );
  });
});
