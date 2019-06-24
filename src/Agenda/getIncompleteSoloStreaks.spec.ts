import { getIncompleteSoloStreaks } from "./getIncompleteSoloStreaks";

describe("getIncompleteSoloStreaks ", async () => {
  test("that getIncompleteSoloStreaks calls find with correct query paramaters", async () => {
    expect.assertions(1);
    const find = jest.fn(() => Promise.resolve(true));
    const soloStreakModel = {
      find
    } as any;
    const timezone = "Europe/London";
    await getIncompleteSoloStreaks(soloStreakModel, timezone);
    expect(find).toBeCalledWith({
      timezone,
      completedToday: false,
      "currentStreak.startDate": { $exists: true }
    });
  });
});
