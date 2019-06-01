"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const agenda_1 = __importDefault(require("agenda"));
const DATABASE_CONFIG_1 = __importDefault(require("../../config/DATABASE_CONFIG"));
const SoloStreak_1 = require("../Models/SoloStreak");
const manageSoloStreaksForTimezone_1 = require("./manageSoloStreaksForTimezone");
const ENVIRONMENT_CONFIG_1 = require("../../config/ENVIRONMENT_CONFIG");
const databseURL = DATABASE_CONFIG_1.default[process.env.NODE_ENV || ENVIRONMENT_CONFIG_1.Environments.PROD];
const agenda = new agenda_1.default({
    db: {
        address: databseURL,
        collection: "AgendaJobs",
        options: {
            useNewUrlParser: true
        }
    },
    processEvery: "30 seconds"
});
var AgendaJobs;
(function (AgendaJobs) {
    AgendaJobs["soloStreakCompleteForTimezoneTracker"] = "soloStreakCompleteForTimezoneTracker";
})(AgendaJobs = exports.AgendaJobs || (exports.AgendaJobs = {}));
var AgendaProcessTimes;
(function (AgendaProcessTimes) {
    AgendaProcessTimes["day"] = "24 hours";
})(AgendaProcessTimes = exports.AgendaProcessTimes || (exports.AgendaProcessTimes = {}));
var AgendaTimeRanges;
(function (AgendaTimeRanges) {
    AgendaTimeRanges["day"] = "day";
})(AgendaTimeRanges = exports.AgendaTimeRanges || (exports.AgendaTimeRanges = {}));
agenda.define(AgendaJobs.soloStreakCompleteForTimezoneTracker, (job, done) => __awaiter(this, void 0, void 0, function* () {
    const { timeZone } = job.attrs.data;
    const defaultCurrentStreak = {
        startDate: undefined,
        numberOfDaysInARow: 0
    };
    yield manageSoloStreaksForTimezone_1.manageSoloStreaksForTimezone(timeZone, SoloStreak_1.soloStreakModel, defaultCurrentStreak, new Date());
    done();
}));
exports.default = agenda;
//# sourceMappingURL=agenda.js.map