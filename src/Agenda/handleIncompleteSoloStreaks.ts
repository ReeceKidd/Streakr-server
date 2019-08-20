import * as moment from "moment-timezone";
import { resetIncompleteSoloStreaks } from "./resetIncompleteSoloStreaks";
import streakoid from "../sdk/streakoid";

export const handleIncompleteSoloStreaks = async (timezone: string) => {
  const incompleteSoloStreaksResponse = await streakoid.soloStreaks.getAll(
    undefined,
    false,
    timezone
  );
  const incompleteSoloStreaks = incompleteSoloStreaksResponse.data;
  return resetIncompleteSoloStreaks(
    incompleteSoloStreaks,
    moment.tz(timezone).toDate(),
    timezone
  );
};
