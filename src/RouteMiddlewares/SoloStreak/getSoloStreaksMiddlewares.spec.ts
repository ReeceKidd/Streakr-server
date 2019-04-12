import { getSoloStreaksMiddlewares, getSoloStreakValidationMiddleware, retreiveUserMiddleware, userExistsValidationMiddleware, retreiveSoloStreaksMiddleware, formatSoloStreaksMiddleware, sendFormattedSoloStreaksMiddleware } from "./getSoloStreaksMiddlewares";

describe(`getSoloStreaksMiddlewares`, () => {
    test("that getSoloStreaksMiddlewares are defined in the correct order", async () => {
        expect(getSoloStreaksMiddlewares[0]).toBe(getSoloStreakValidationMiddleware)
        expect(getSoloStreaksMiddlewares[1]).toBe(retreiveUserMiddleware)
        expect(getSoloStreaksMiddlewares[2]).toBe(userExistsValidationMiddleware)
        expect(getSoloStreaksMiddlewares[3]).toBe(retreiveSoloStreaksMiddleware)
        expect(getSoloStreaksMiddlewares[4]).toBe(formatSoloStreaksMiddleware)
        expect(getSoloStreaksMiddlewares[5]).toBe(sendFormattedSoloStreaksMiddleware)
    });
});