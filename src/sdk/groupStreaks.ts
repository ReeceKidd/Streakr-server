import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
const { APPLICATION_URL } = getServiceConfig();

import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";
import { SupportedRequestHeaders } from "../Server/headers";

const create = (
  creatorId: string,
  groupName: string,
  streakName: string,
  streakDescription: string,
  members: string[],
  timezone: string
) => {
  return axios.post(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.groupStreaks}`,
    { creatorId, groupName, streakName, streakDescription, members },
    { headers: { [SupportedRequestHeaders.xTimezone]: timezone } }
  );
};

const groupStreaks = {
  create
};

export default groupStreaks;
