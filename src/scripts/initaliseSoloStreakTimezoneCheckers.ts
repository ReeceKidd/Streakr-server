import moment from "moment";
import { agendaJobModel } from "../Models/AgendaJob";
import agenda, {
  AgendaJobs,
  AgendaTimeRanges,
  AgendaProcessTimes
} from "../Agenda/agenda";

export const initialiseSoloStreakTimezoneCheckerJobs = async () => {
  const timezones = moment.tz.names();
  const numberOfTimezones = timezones.length;

  const numberOfSoloStreakTimezoneCheckerJobs = await agendaJobModel.countDocuments(
    {
      name: AgendaJobs.soloStreakDailyTracker,
      "data.custom": false
    }
  );
  if (numberOfTimezones === numberOfSoloStreakTimezoneCheckerJobs) {
    console.log(
      "Number of timezones matches number of solo streak timezone checker jobs. No jobs need to be created"
    );
    return;
  } else {
    console.log("Creating new daily solo steak tracker jobs");
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
  const currentTimeInTimezone = moment().tz(timezone);
  const endOfDayForTimezone = currentTimeInTimezone
    .endOf(AgendaTimeRanges.day)
    .toDate();
  const nextRunTime = endOfDayForTimezone;
  await agenda.start();
  const job = await agenda.schedule(
    nextRunTime,
    AgendaJobs.soloStreakDailyTracker,
    { timezone, custom: false }
  );
  await job.repeatEvery(AgendaProcessTimes.twentyFourHours);
  return job.save();
};
