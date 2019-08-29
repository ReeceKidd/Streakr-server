import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
const { APPLICATION_URL } = getServiceConfig();

import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";
import { SupportedRequestHeaders } from "../Server/headers";

const create = (
  userId: string,
  name: string,
  description: string,
  timezone: string
) => {
  return axios.post(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.soloStreaks}`,
    { userId, name, description },
    { headers: { [SupportedRequestHeaders.xTimezone]: timezone } }
  );
};

const groupStreaks = {
  create
};

export default groupStreaks;
