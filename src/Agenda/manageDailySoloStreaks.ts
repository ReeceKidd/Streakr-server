import moment from "moment-timezone";

import streakoid from "../sdk/streakoid";
import { trackMaintainedSoloStreaks } from "./trackMaintainedSoloStreaks";
import { trackInactiveSoloStreaks } from "./trackInactiveSoloStreaks";
import { resetIncompleteSoloStreaks } from "./resetIncompleteSoloStreaks";

export const manageDailySoloStreaks = async (timezone: string) => {
  const currentLocalTime = moment.tz(timezone).toDate();

  const maintainedSoloStreakResponse = await streakoid.soloStreaks.getAll({
    completedToday: true,
    timezone: timezone
  });
  const maintainedSoloStreaks = maintainedSoloStreakResponse.data.soloStreaks;
  trackMaintainedSoloStreaks(maintainedSoloStreaks, currentLocalTime);

  const inactiveSoloStreakResponse = await streakoid.soloStreaks.getAll({
    completedToday: false,
    active: false,
    timezone
  });
  const inactiveSoloStreaks = inactiveSoloStreakResponse.data.soloStreaks;
  trackInactiveSoloStreaks(inactiveSoloStreaks, currentLocalTime);

  const incompleteSoloStreaksResponse = await streakoid.soloStreaks.getAll({
    completedToday: false,
    active: true,
    timezone: timezone
  });
  const incompleteSoloStreaks = incompleteSoloStreaksResponse.data.soloStreaks;
  resetIncompleteSoloStreaks(incompleteSoloStreaks, currentLocalTime, timezone);
};
