"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const manageSoloStreaksForTimezone_1 = require("./manageSoloStreaksForTimezone");
describe("manageSoloStreaksForTimezone", () => {
    const defaultCurrentStreak = {
        startDate: undefined,
        numberOfDaysInARow: 0
    };
    const endDate = new Date();
    test("that incomplete solo streaks default current streak is reset and old streak is pushed to past streaks for multiple solo streaks", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(3);
        const timezone = "Europe/London";
        const soloStreaks = [
            {
                _id: 1,
                currentStreak: {
                    startDate: undefined,
                    numberOfDaysInARow: 0
                },
                startDate: new Date(),
                completedToday: false,
                pastStreaks: [],
                name: "Daily Danish",
                description: "Each day I must do Danish",
                userId: "5c35116059f7ba19e4e248a9",
                timezone: "Europe/London",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                _id: 2,
                currentStreak: {
                    startDate: undefined,
                    numberOfDaysInARow: 0
                },
                startDate: new Date(),
                completedToday: false,
                pastStreaks: [],
                name: "Daily Danish",
                description: "Each day I must do Danish",
                userId: "5c35116059f7ba19e4e248a9",
                timezone: "Europe/London",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];
        const lean = jest.fn(() => (Promise.resolve(soloStreaks)));
        const find = jest.fn(() => ({ lean }));
        const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
        const soloStreakModel = {
            find,
            findByIdAndUpdate
        };
        yield manageSoloStreaksForTimezone_1.manageSoloStreaksForTimezone(timezone, soloStreakModel, defaultCurrentStreak, endDate);
        expect(find).toBeCalledWith({ timezone, completedToday: false });
        expect(lean).toBeCalledWith();
        expect(findByIdAndUpdate).toBeCalledTimes(soloStreaks.length);
    }));
    test("that incomplete solo streaks default current streak is reset and old streak is pushed to past streaks for single streaks", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(3);
        const timezone = "Europe/London";
        const soloStreaks = [
            {
                _id: 1,
                currentStreak: {
                    startDate: undefined,
                    numberOfDaysInARow: 0
                },
                startDate: new Date(),
                completedToday: false,
                pastStreaks: [],
                name: "Daily Danish",
                description: "Each day I must do Danish",
                userId: "5c35116059f7ba19e4e248a9",
                timezone: "Europe/London",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];
        const lean = jest.fn(() => (Promise.resolve(soloStreaks)));
        const find = jest.fn(() => ({ lean }));
        const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
        const soloStreakModel = {
            find,
            findByIdAndUpdate
        };
        yield manageSoloStreaksForTimezone_1.manageSoloStreaksForTimezone(timezone, soloStreakModel, defaultCurrentStreak, endDate);
        expect(find).toBeCalledWith({ timezone, completedToday: false });
        expect(lean).toBeCalledWith();
        expect(findByIdAndUpdate).toBeCalledWith(soloStreaks[0]._id, { currentStreak: defaultCurrentStreak, $push: { pastStreaks: Object.assign({}, soloStreaks[0].currentStreak, { endDate }) } });
    }));
});
//# sourceMappingURL=manageSoloStreaksForTimezone.spec.js.map