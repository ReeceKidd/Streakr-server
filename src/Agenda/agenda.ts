import Agenda from "agenda";
import { soloStreakModel } from "../Models/SoloStreak";
import { resetSoloStreaksNotCompletedTodayByTimezone } from "./resetSoloStreaksNotCompletedTodayByTimezone";
import databaseConnectionString from "../../config/databaseConnectionString";
import { getIncompleteSoloStreaks } from "./getIncompleteSoloStreaks";
import { resetIncompleteSoloStreaks } from "./resetIncompleteSoloStreaks";

const agenda = new Agenda({
    db: {
        address: databaseConnectionString,
        collection: "AgendaJobs",
        options: {
            useNewUrlParser: true
        }
    },
    processEvery: "30 seconds"
});

export enum AgendaJobs {
    soloStreakCompleteForTimezoneTracker = "soloStreakCompleteForTimezoneTracker"
}

export enum AgendaProcessTimes {
    day = "24 hours"
}

export enum AgendaTimeRanges {
    day = "day"
}

agenda.define(AgendaJobs.soloStreakCompleteForTimezoneTracker, async (job, done) => {
    const { timezone } = job.attrs.data;
    const defaultCurrentStreak = {
        startDate: undefined,
        numberOfDaysInARow: 0
    };
    const endDate = new Date();
    await resetSoloStreaksNotCompletedTodayByTimezone(soloStreakModel, getIncompleteSoloStreaks, resetIncompleteSoloStreaks, timezone, defaultCurrentStreak, endDate);
    done();
});

export default agenda;