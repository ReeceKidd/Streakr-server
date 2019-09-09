import moment from "moment-timezone";

import streakoid from "../sdk/streakoid";
import { trackMaintainedSoloStreaks } from "./trackMaintainedSoloStreaks";
import { trackInactiveSoloStreaks } from "./trackInactiveSoloStreaks";
import { resetIncompleteSoloStreaks } from "./resetIncompleteSoloStreaks";

export const manageDailySoloStreaks = async (timezone: string) => {
  console.log("Entered manageDailySoloSreaks", timezone);
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
  console.log(`Maintained: ${maintainedSoloStreaks.length}`);
  const inactiveSoloStreaks = inactiveSoloStreakResponse.data.soloStreaks;
  console.log(`Inactive solo streaks: ${inactiveSoloStreaks.length}`);
  const incompleteSoloStreaks = incompleteSoloStreaksResponse.data.soloStreaks;
  console.log(`Incomplete solo streaks: ${incompleteSoloStreaks.length}`);

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
