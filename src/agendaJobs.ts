import agenda from "../config/Agenda";
import logger from "./Logging/Logger";

export enum AgendaJobs {
    soloStreakTracker = 'soloStreakTracker'
}

agenda.define(AgendaJobs.soloStreakTracker, async (job, done) => {
    logger.log('error', 'Created agenda job')
    done()
})