import moment from "moment";

import { agendaJobModel } from "../Models/AgendaJob";
import {
  agenda,
  AgendaJobs,
  AgendaTimeRanges,
  AgendaProcessTimes
} from "../Agenda/agenda";

export const initialiseGroupMemberStreakTimezoneCheckerJobs = async () => {
  const timezones = moment.tz.names();
  const numberOfTimezones = timezones.length;

  const numberOfGroupMemberStreakTimezoneCheckerJobs = await agendaJobModel.countDocuments(
    {
      name: AgendaJobs.groupMemberStreakDailyTracker
    }
  );
  console.log(
    `Number of group member streak daily tracker jobs: ${numberOfGroupMemberStreakTimezoneCheckerJobs}`
  );
  console.log(`Number of timezones: ${numberOfTimezones}`);
  if (numberOfTimezones === numberOfGroupMemberStreakTimezoneCheckerJobs) {
    console.log(
      "Number of timezones matches number of group streak member timezone checker jobs. No jobs need to be created"
    );
    return;
  }

  return timezones.map(async (timezone: string) => {
    const existingTimezone = await agendaJobModel.findOne({
      name: AgendaJobs.groupMemberStreakDailyTracker,
      "data.timezone": timezone
    });

    if (!existingTimezone) {
      await createGroupMemberStreakDailyTrackerJob(timezone);
    }
  });
};

export const createGroupMemberStreakDailyTrackerJob = async (
  timezone: string
) => {
  const endOfDay = moment.tz(timezone).endOf(AgendaTimeRanges.day);
  return (async () => {
    const groupMemberStreakDailyTrackerJob = agenda.create(
      AgendaJobs.groupMemberStreakDailyTracker,
      { timezone }
    );
    groupMemberStreakDailyTrackerJob.schedule(endOfDay.toDate());
    await agenda.start();
    await groupMemberStreakDailyTrackerJob
      .repeatEvery(AgendaProcessTimes.oneDay)
      .save();
    return groupMemberStreakDailyTrackerJob;
  })();
};
