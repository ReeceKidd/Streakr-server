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
  soloStreakDailyTracker = "soloStreakDailyTracker"
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
  console.log("Entered job");
  const timezone = job.attrs.data.timezone;
  console.log(`Timezone: ${timezone}`);
  await handleIncompleteSoloStreaks(timezone);
  done();
};

agenda.define(
  AgendaJobs.soloStreakDailyTracker,
  soloStreakCompleteForTimezoneTracker
);

export default agenda;
