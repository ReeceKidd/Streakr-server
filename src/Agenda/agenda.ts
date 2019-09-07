import Agenda from "agenda";
import { getServiceConfig } from "../getServiceConfig";
import { manageDailySoloStreaks } from "./manageDailySoloStreaks";

const { DATABASE_URI } = getServiceConfig();
export const agenda = new Agenda({
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
  soloStreakDailyTracker = "soloStreakDailyTracker"
}

export enum AgendaTimeRanges {
  day = "day"
}

export enum AgendaProcessTimes {
  twentyFourHours = "24 hours"
}

interface SoloStreakCompleteForTimezoneTrackerData
  extends Agenda.JobAttributesData {
  timezone?: string;
}

export const soloStreakCompleteForTimezoneTracker = async (
  job: SoloStreakCompleteForTimezoneTrackerData,
  done: (err?: Error | undefined) => void
) => {
  const timezone = job.attrs.data.timezone;
  await manageDailySoloStreaks(timezone);
  done();
};

agenda.define(
  AgendaJobs.soloStreakDailyTracker,
  soloStreakCompleteForTimezoneTracker
);

export default agenda;
