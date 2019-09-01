import moment from "moment";
import { agendaJobModel } from "../Models/AgendaJob";
import agenda, {
  AgendaJobs,
  AgendaTimeRanges,
  AgendaProcessTimes
} from "../Agenda/agenda";

export const initialiseStreakTimezoneCheckerJobs = async () => {
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
      await job.repeatEvery(AgendaProcessTimes.day);
      await job.save();
    }
  });
};
