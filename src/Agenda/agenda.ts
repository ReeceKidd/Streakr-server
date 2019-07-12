import Agenda from "agenda";
import { getServiceConfig } from "../getServiceConfig";
import { handleIncompleteSoloStreaks } from "./handleIncompleteSoloStreaks";

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
    await handleIncompleteSoloStreaks(timezone);
    done();
  }
);

export default agenda;
