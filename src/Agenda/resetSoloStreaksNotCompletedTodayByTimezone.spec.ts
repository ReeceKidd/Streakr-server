import { resetSoloStreaksNotCompletedTodayByTimezone } from "./resetSoloStreaksNotCompletedTodayByTimezone";

describe("resetSoloStreaksNotCompletedTodayByTimezone", () => {
  test("that function calls functions it requires correctly", async () => {
    const soloStreakModel = {} as any;
    const incompleteSoloStreaks: any = [];
    const getIncompleteSoloStreaks = jest.fn(() =>
      Promise.resolve(incompleteSoloStreaks)
    );
    const resetIncompleteSoloStreaks = jest.fn();
    const timezone = "Europe/London";
    const defaultCurrentStreak = {
      numberOfDaysInARow: 0
    };
    const endDate = new Date();
    await resetSoloStreaksNotCompletedTodayByTimezone(
      soloStreakModel,
      getIncompleteSoloStreaks,
      resetIncompleteSoloStreaks,
      timezone,
      defaultCurrentStreak,
      endDate
    );
    expect(getIncompleteSoloStreaks).toBeCalledWith(soloStreakModel, timezone);
    expect(resetIncompleteSoloStreaks).toBeCalledWith(
      soloStreakModel,
      incompleteSoloStreaks,
      defaultCurrentStreak,
      endDate
    );
  });
});
