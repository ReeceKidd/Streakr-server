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
import { handleIncompleteSoloStreaks } from "./handleIncompleteSoloStreaks";
import streakoid from "../sdk/streakoid";

describe("handleIncompleteSoloStreaks", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("calls getIncompleteSoloStreaks and resetIncompleteSoloStreaks directly", async () => {
    expect.assertions(2);
    streakoid.soloStreaks.getAll = jest.fn(() => {
      return {
        data: []
      };
    });
    const timezone = "Europe/London";
    await handleIncompleteSoloStreaks(timezone);
    expect(streakoid.soloStreaks.getAll).toBeCalledWith(
      undefined,
      false,
      timezone
    );
    expect(resetIncompleteSoloStreaks).toBeCalledWith(
      expect.any(Array),
      moment.tz(timezone).toDate(),
      timezone
    );
  });
});
