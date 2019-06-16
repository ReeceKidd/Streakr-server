import moment from "moment";
import { agendaJobModel } from "../Models/AgendaJob";
import agenda, { AgendaTimeRanges, AgendaProcessTimes, AgendaJobs } from "../Agenda/agenda";

export const getInitialiseStreakTimezoneCheckerJobs = (moment, agendaJobModel, agenda, agendaTimeRangeDay, agendaProcessTimeDay, soloStreakCompleteForTimezoneTracker) => {
    const timezones = moment.tz.names();
    return timezones.map(async timezone => {
        const existingTimezone = await agendaJobModel.findOne({ "data.timezone": timezone, name: soloStreakCompleteForTimezoneTracker });
        if (!existingTimezone) {
            const currentTimeInTimezone = moment().tz(timezone);
            const endOfDayForTimezone = currentTimeInTimezone.endOf(agendaTimeRangeDay).toDate();
            await agenda.start();
            const job = await agenda.schedule(endOfDayForTimezone, soloStreakCompleteForTimezoneTracker, { timezone });
            await job.repeatEvery(agendaProcessTimeDay);
            await job.save();
        }
    });
};

export const initialiseStreakTimezoneCheckerJobs = getInitialiseStreakTimezoneCheckerJobs(moment, agendaJobModel, agenda, AgendaTimeRanges.day, AgendaProcessTimes.day, AgendaJobs.soloStreakCompleteForTimezoneTracker);

