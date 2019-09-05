import moment from "moment";
import { agendaJobModel } from "../Models/AgendaJob";
import agenda, { AgendaJobs } from "../Agenda/agenda";
import { getServiceConfig } from "../getServiceConfig";

const {
  AGENDA_SOLO_STREAK_TRACKER_REPEAT_INTERVAL,
  AGENDA_SOLO_STREAK_TRACKER_NEXT_RUN_AT_END_OF
} = getServiceConfig();

export const initialiseSoloStreakTimezoneCheckerJobs = async () => {
  const environmentRepeatInterval = AGENDA_SOLO_STREAK_TRACKER_REPEAT_INTERVAL;

  const currentDailySoloStreakTrackerSetup = await agendaJobModel
    .findOne({ name: AgendaJobs.soloStreakDailyTracker, "data.custom": false })
    .lean();
  if (currentDailySoloStreakTrackerSetup) {
    const { repeatInterval } = currentDailySoloStreakTrackerSetup;
    if (repeatInterval !== environmentRepeatInterval) {
      console.log(
        `Clear soloStreak timezone checker jobs as repeat interval has changed from ${repeatInterval} to ${environmentRepeatInterval} `
      );
      await agendaJobModel.deleteMany({
        name: AgendaJobs.soloStreakDailyTracker
      });
    }

    const { data } = currentDailySoloStreakTrackerSetup;
    const { endOfTime } = data;
    if (endOfTime !== AGENDA_SOLO_STREAK_TRACKER_NEXT_RUN_AT_END_OF) {
      console.log(
        `Clear soloStreak timezone checker jobs as endOfTime has changed from ${endOfTime} to ${AGENDA_SOLO_STREAK_TRACKER_NEXT_RUN_AT_END_OF} `
      );
      await agendaJobModel.deleteMany({
        name: AgendaJobs.soloStreakDailyTracker
      });
    }
  }

  console.log(
    `soloStreakTimezoneChecker repeat interval: ${AGENDA_SOLO_STREAK_TRACKER_REPEAT_INTERVAL}, run at end of: ${AGENDA_SOLO_STREAK_TRACKER_NEXT_RUN_AT_END_OF}`
  );

  const timezones = moment.tz.names();
  const numberOfTimezones = timezones.length;
  const numberOfSoloStreakTimezoneCheckerJobs = await agendaJobModel.countDocuments(
    { name: AgendaJobs.soloStreakDailyTracker, "data.custom": false }
  );
  if (numberOfTimezones === numberOfSoloStreakTimezoneCheckerJobs) {
    console.log(
      "Number of timezones matches number of solo streak timezone checker jobs. No jobs need to be created"
    );
    return;
  }
  return timezones.map(async (timezone: string) => {
    const existingTimezone = await agendaJobModel.findOne({
      name: AgendaJobs.soloStreakDailyTracker,
      "data.timezone": timezone
    });

    if (!existingTimezone) {
      await createSoloStreakDailyTrackerJob(timezone);
    }
  });
};

export const createSoloStreakDailyTrackerJob = async (timezone: string) => {
  const endOfTime = AGENDA_SOLO_STREAK_TRACKER_NEXT_RUN_AT_END_OF;
  const currentTimeInTimezone = moment().tz(timezone);
  const endOfDayForTimezone = currentTimeInTimezone
    .endOf(endOfTime as any)
    .toDate();
  const nextRunTime = endOfDayForTimezone;
  await agenda.start();
  const job = await agenda.schedule(
    nextRunTime,
    AgendaJobs.soloStreakDailyTracker,
    { timezone, endOfTime, custom: false }
  );
  await job.repeatEvery(AGENDA_SOLO_STREAK_TRACKER_REPEAT_INTERVAL);
  return job.save();
};
