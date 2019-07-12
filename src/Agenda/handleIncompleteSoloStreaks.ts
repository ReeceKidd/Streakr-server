import * as moment from "moment-timezone";
import { getIncompleteSoloStreaks } from "./getIncompleteSoloStreaks";
import { resetIncompleteSoloStreaks } from "./resetIncompleteSoloStreaks";

export const handleIncompleteSoloStreaks = async (timezone: string) => {
  const incompleteSoloStreaks = await getIncompleteSoloStreaks(timezone);
  return resetIncompleteSoloStreaks(
    incompleteSoloStreaks,
    moment.tz(timezone).toDate()
  );
};
