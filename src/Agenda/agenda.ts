import Agenda from "agenda";
import { soloStreakModel } from "../Models/SoloStreak";
import { manageSoloStreaksForTimezone } from "./manageSoloStreaksForTimezone";
import { databaseConnectionString } from "../../config/databaseConnectionString";

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
    const { timeZone } = job.attrs.data;
    const defaultCurrentStreak = {
        startDate: undefined,
        numberOfDaysInARow: 0
    };
    await manageSoloStreaksForTimezone(timeZone, soloStreakModel, defaultCurrentStreak, new Date());
    done();
});

export default agenda;