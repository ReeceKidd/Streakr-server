import * as moment from "moment-timezone";
import { resetIncompleteSoloStreaks } from "./resetIncompleteSoloStreaks";
import streakoid from "../sdk/streakoid";

export const manageDailySoloStreaks = async (timezone: string) => {
  const incompleteSoloStreaksResponse = await streakoid.soloStreaks.getAll({
    completedToday: false,
    timezone: timezone
  });
  const incompleteSoloStreaks = incompleteSoloStreaksResponse.data.soloStreaks;

  // Define a function that logs that the streaks were maintained if the streak was completed that
  // day

  return resetIncompleteSoloStreaks(
    incompleteSoloStreaks,
    moment.tz(timezone).toDate(),
    timezone
  );
};
