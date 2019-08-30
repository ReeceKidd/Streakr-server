import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
const { APPLICATION_URL } = getServiceConfig();

import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";
import { SupportedRequestHeaders } from "../Server/headers";

const getAll = (
  memberId?: string,
  completedToday?: boolean,
  timezone?: string
) => {
  let getAllSoloStreaksURL = `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.groupStreaks}?`;
  if (memberId) {
    getAllSoloStreaksURL = `${getAllSoloStreaksURL}memberId=${memberId}&`;
  }
  if (completedToday) {
    getAllSoloStreaksURL = `${getAllSoloStreaksURL}completedToday=${completedToday}&`;
  }
  if (timezone) {
    getAllSoloStreaksURL = `${getAllSoloStreaksURL}timezone=${timezone}`;
  }
  return axios.get(getAllSoloStreaksURL);
};

const create = (
  creatorId: string,
  streakName: string,
  streakDescription: string,
  members: string[],
  timezone: string
) => {
  return axios.post(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.groupStreaks}`,
    { creatorId, streakName, streakDescription, members },
    { headers: { [SupportedRequestHeaders.xTimezone]: timezone } }
  );
};

const groupStreaks = {
  getAll,
  create
};

export default groupStreaks;
