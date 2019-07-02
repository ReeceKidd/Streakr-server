import { getIncompleteSoloStreaks } from "./getIncompleteSoloStreaks";
import { soloStreakModel } from "../Models/SoloStreak";

describe("getIncompleteSoloStreaks ", async () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("that getIncompleteSoloStreaks calls find with correct query paramaters", async () => {
    expect.assertions(1);
    soloStreakModel.find = jest.fn();
    const timezone = "Europe/London";
    await getIncompleteSoloStreaks(timezone);
    expect(soloStreakModel.find).toBeCalledWith({
      timezone,
      completedToday: false,
      "currentStreak.startDate": { $exists: true }
    });
  });
});
