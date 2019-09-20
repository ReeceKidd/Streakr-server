import moment from "moment-timezone";

import { trackMaintainedSoloStreaks } from "../SoloStreaks/trackMaintainedSoloStreaks";
import { trackInactiveSoloStreaks } from "../SoloStreaks/trackInactiveSoloStreaks";
import { resetIncompleteSoloStreaks } from "../SoloStreaks/resetIncompleteSoloStreaks";
import streakoid from "../../streakoid";

export const manageDailyGroupMemberStreaks = async (timezone: string) => {
  const currentLocalTime = moment
    .tz(timezone)
    .toDate()
    .toString();

  const [
    maintainedSoloStreaks,
    inactiveSoloStreaks,
    incompleteSoloStreaks
  ] = await Promise.all([
    streakoid.soloStreaks.getAll({}),
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

  return Promise.all([
    trackMaintainedSoloStreaks(
      maintainedSoloStreaks,
      currentLocalTime.toString()
    ),
    trackInactiveSoloStreaks(inactiveSoloStreaks, currentLocalTime),
    resetIncompleteSoloStreaks(
      incompleteSoloStreaks,
      currentLocalTime,
      timezone
    )
  ]);
};
