import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
const { APPLICATION_URL } = getServiceConfig();

import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";
import { StreakTrackingEventType } from "../Models/StreakTrackingEvent";

const create = (
  type: StreakTrackingEventType,
  streakId: string,
  userId: string
) => {
  return axios.post(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.streakTrackingEvents}`,
    { type, streakId, userId }
  );
};

const streakTrackingEvents = {
  create
};

export default streakTrackingEvents;
