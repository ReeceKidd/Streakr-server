import moment from "moment";
import { agendaJobModel } from "../Models/AgendaJob";
import agenda, { AgendaJobs, AgendaTimeRanges } from "../Agenda/agenda";
import { getServiceConfig } from "../getServiceConfig";

const { AGENDA_SOLO_STREAK_TRACKER_REPEAT_INTERVAL } = getServiceConfig();

export const initialiseSoloStreakTimezoneCheckerJobs = async () => {
  const repeatInterval = AGENDA_SOLO_STREAK_TRACKER_REPEAT_INTERVAL;

  const currentSetup = await agendaJobModel.findOne({}).lean();
  if (currentSetup && currentSetup.repeatInterval !== repeatInterval) {
    console.log(
      `Clear soloStreak timezone checker jobs as repeat interval has changed from ${currentSetup.repeatInterval} to ${repeatInterval} `
    );
    await agendaJobModel.deleteMany({
      name: AgendaJobs.soloStreakCompleteForTimezoneTracker
    });
  }

  console.log(`soloStreak timezone checker repeat interval: ${repeatInterval}`);

  const timezones = moment.tz.names();
  const numberOfTimezones = timezones.length;
  const numberOfSoloStreakTimezoneCheckerJobs = await agendaJobModel.countDocuments(
    {}
  );
  if (numberOfTimezones === numberOfSoloStreakTimezoneCheckerJobs) {
    console.log(
      "Number of timezones matches number of solo streak timezone checker jobs. No jobs need to be created"
    );
    return;
  }
  return timezones.map(async (timezone: string) => {
    const existingTimezone = await agendaJobModel.findOne({
      "data.timezone": timezone,
      name: AgendaJobs.soloStreakCompleteForTimezoneTracker
    });
    if (!existingTimezone) {
      const currentTimeInTimezone = moment().tz(timezone);
      const endOfDayForTimezone = currentTimeInTimezone
        .endOf(AgendaTimeRanges.day)
        .toDate();
      await agenda.start();
      const job = await agenda.schedule(
        endOfDayForTimezone,
        AgendaJobs.soloStreakCompleteForTimezoneTracker,
        { timezone }
      );
      await job.repeatEvery(repeatInterval);
      await job.save();
    }
  });
};
