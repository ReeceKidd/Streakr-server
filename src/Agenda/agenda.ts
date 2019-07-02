import Agenda from "agenda";
import * as moment from "moment-timezone";
import { getIncompleteSoloStreaks } from "./getIncompleteSoloStreaks";
import { resetIncompleteSoloStreaks } from "./resetIncompleteSoloStreaks";
import { getServiceConfig } from "../getServiceConfig";

const { DATABASE_URI } = getServiceConfig();
const agenda = new Agenda({
  db: {
    address: DATABASE_URI,
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

agenda.define(
  AgendaJobs.soloStreakCompleteForTimezoneTracker,
  async (job, done) => {
    const { timezone } = job.attrs.data;
    const incompleteSoloStreaks = await getIncompleteSoloStreaks(timezone);
    await resetIncompleteSoloStreaks(
      incompleteSoloStreaks,
      moment.tz(timezone).toDate()
    );
    done();
  }
);

export default agenda;
