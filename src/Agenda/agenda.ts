import Agenda from "agenda";
import { getServiceConfig } from "../getServiceConfig";
import { handleIncompleteSoloStreaks } from "./handleIncompleteSoloStreaks";

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
  soloStreakCompleteForTimezoneTracker = "soloStreakCompleteForTimezoneTracker"
}

export enum AgendaTimeRanges {
  day = "day"
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
  await handleIncompleteSoloStreaks(timezone);
  done();
};

agenda.define(
  AgendaJobs.soloStreakCompleteForTimezoneTracker,
  soloStreakCompleteForTimezoneTracker
);

export default agenda;
