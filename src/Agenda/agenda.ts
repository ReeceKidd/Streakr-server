import Agenda from "agenda";

import { getServiceConfig } from "../getServiceConfig";
import { manageDailySoloStreaks } from "./manageDailySoloStreaks";
import { sendEmail } from "../email";

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

agenda.on("success", async job => {
  try {
    const message = `Ran job: ${job.attrs.name} for timezone: ${
      job.attrs.data.timezone
    }, at ${new Date()}`;
    await sendEmail("Agenda Success", message);
  } catch (err) {
    console.log(err);
  }
});

agenda.on("fail", async (err, job) => {
  try {
    const message = `Ran job: ${job.attrs.name} for timezone: ${
      job.attrs.data.timezone
    },
      At ${new Date()}
      Failure reason: ${err.message}
      Failure count ${job.attrs.failCount}`;
    await sendEmail("Agenda Failure", message);
  } catch (err) {
    console.log(err);
  }
});

agenda.define(
  AgendaJobs.soloStreakDailyTracker,
  { priority: "high" },
  async (job, done) => {
    try {
      const { timezone } = job.attrs.data;
      await manageDailySoloStreaks(timezone);
      done();
    } catch (err) {
      done(err);
    }
  }
);
