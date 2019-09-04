import moment from "moment-timezone";
import { resetIncompleteSoloStreaks } from "./resetIncompleteSoloStreaks";
import streakoid from "../sdk/streakoid";
import { trackMaintainedSoloStreaks } from "./trackMaintainedSoloStreaks";

export const manageDailySoloStreaks = async (timezone: string) => {
  const currentLocalTime = moment.tz(timezone).toDate();

  const maintainedSoloStreakResponse = await streakoid.soloStreaks.getAll({
    completedToday: true,
    timezone: timezone
  });
  const maintainedSoloStreaks = maintainedSoloStreakResponse.data.soloStreaks;

  trackMaintainedSoloStreaks(maintainedSoloStreaks, currentLocalTime);

  const incompleteSoloStreaksResponse = await streakoid.soloStreaks.getAll({
    completedToday: false,
    timezone: timezone
  });
  const incompleteSoloStreaks = incompleteSoloStreaksResponse.data.soloStreaks;

  resetIncompleteSoloStreaks(incompleteSoloStreaks, currentLocalTime, timezone);
};
