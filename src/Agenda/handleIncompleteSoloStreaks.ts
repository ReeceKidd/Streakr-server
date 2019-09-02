import * as moment from "moment-timezone";
import { resetIncompleteSoloStreaks } from "./resetIncompleteSoloStreaks";
import streakoid from "../sdk/streakoid";

export const handleIncompleteSoloStreaks = async (timezone: string) => {
  const incompleteSoloStreaksResponse = await streakoid.soloStreaks.getAll({
    completedToday: false,
    timezone: timezone
  });
  const incompleteSoloStreaks = incompleteSoloStreaksResponse.data.soloStreaks;
  return resetIncompleteSoloStreaks(
    incompleteSoloStreaks,
    moment.tz(timezone).toDate(),
    timezone
  );
};
