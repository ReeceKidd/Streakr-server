jest.mock("moment-timezone", () => ({
  tz: jest.fn(() => ({
    toDate: jest.fn(() => true)
  }))
}));
jest.mock("./getIncompleteSoloStreaks", () => ({
  __esModule: true,
  getIncompleteSoloStreaks: jest.fn().mockResolvedValue(true)
}));
jest.mock("./resetIncompleteSoloStreaks", () => ({
  __esModule: true,
  resetIncompleteSoloStreaks: jest.fn().mockResolvedValue(true)
}));

import * as moment from "moment-timezone";
import { resetIncompleteSoloStreaks } from "./resetIncompleteSoloStreaks";
import { handleIncompleteSoloStreaks } from "./handleIncompleteSoloStreaks";

describe("handleIncompleteSoloStreaks", () => {
  test("calls getIncompleteSoloStreaks and resetIncompleteSoloStreaks directly", async () => {
    expect.assertions(2);
    const timezone = "Europe/London";
    await handleIncompleteSoloStreaks(timezone);
    expect(resetIncompleteSoloStreaks).toBeCalledWith(
      true,
      moment.tz(timezone).toDate()
    );
  });
});
