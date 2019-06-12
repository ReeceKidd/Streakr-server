import { getIncompleteSoloStreaks } from "./getIncompleteSoloStreaks";

describe("getIncompleteSoloStreaks ", async () => {
    test("that getIncompleteSoloStreaks calls find with correct query paramaters", async () => {
        expect.assertions(2);
        const lean = jest.fn(() => Promise.resolve(true));
        const find = jest.fn(() => Promise.resolve({ lean }));
        const soloStreakModel = {
            find
        };
        const timezone = "Europe/London";
        await getIncompleteSoloStreaks(soloStreakModel, timezone);
        expect(find).toBeCalledWith({ timezone, completedToday: false });
        expect(lean).toBeCalledWith();
    });
});