import Agenda from "agenda";

import { getServiceConfig } from "../getServiceConfig";
import { manageDailySoloStreaks } from "./manageDailySoloStreaks";

const { DATABASE_URI } = getServiceConfig();

export enum AgendaJobs {
  soloStreakDailyTracker = "soloStreakDailyTracker"
}

export enum AgendaTimeRanges {
  day = "day"
}

export enum AgendaProcessTimes {
  oneDay = "1 day"
}

export const agenda = new Agenda({
  db: {
    address: DATABASE_URI,
    collection: "AgendaJobs",
    options: {
      useNewUrlParser: true
    }
  },
  processEvery: "30 Seconds"
});

agenda.define(
  AgendaJobs.soloStreakDailyTracker,
  { priority: "high" },
  async (job, done) => {
    const { timezone } = job.attrs.data;
    await manageDailySoloStreaks(timezone);
    done();
  }
);
