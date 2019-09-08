import moment from "moment-timezone";

import streakoid from "../sdk/streakoid";
import { trackMaintainedSoloStreaks } from "./trackMaintainedSoloStreaks";
import { trackInactiveSoloStreaks } from "./trackInactiveSoloStreaks";
import { resetIncompleteSoloStreaks } from "./resetIncompleteSoloStreaks";

export const manageDailySoloStreaks = async (timezone: string) => {
  const currentLocalTime = moment.tz(timezone).toDate();

  const [
    maintainedSoloStreakResponse,
    inactiveSoloStreakResponse,
    incompleteSoloStreaksResponse
  ] = await Promise.all([
    streakoid.soloStreaks.getAll({
      completedToday: true,
      active: true,
      timezone: timezone
    }),
    streakoid.soloStreaks.getAll({
      completedToday: false,
      active: false,
      timezone
    }),
    streakoid.soloStreaks.getAll({
      completedToday: false,
      active: true,
      timezone: timezone
    })
  ]);

  const maintainedSoloStreaks = maintainedSoloStreakResponse.data.soloStreaks;
  const inactiveSoloStreaks = inactiveSoloStreakResponse.data.soloStreaks;
  const incompleteSoloStreaks = incompleteSoloStreaksResponse.data.soloStreaks;

  return Promise.all([
    trackMaintainedSoloStreaks(maintainedSoloStreaks, currentLocalTime),
    trackInactiveSoloStreaks(inactiveSoloStreaks, currentLocalTime),
    resetIncompleteSoloStreaks(
      incompleteSoloStreaks,
      currentLocalTime,
      timezone
    )
  ]);
};
