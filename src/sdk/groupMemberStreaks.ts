import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
const { APPLICATION_URL } = getServiceConfig();

import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";
import { SupportedRequestHeaders } from "../Server/headers";

const create = (userId: string, groupStreakId: string, timezone: string) => {
  return axios.post(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.groupMemberStreaks}`,
    { userId, groupStreakId },
    { headers: { [SupportedRequestHeaders.xTimezone]: timezone } }
  );
};

const getOne = (groupMemberStreakId: string) => {
  return axios.get(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.groupMemberStreaks}/${groupMemberStreakId}`
  );
};

const deleteOne = (groupMemberStreakId: string) => {
  return axios.delete(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.groupMemberStreaks}/${groupMemberStreakId}`
  );
};

const groupMemberStreaks = {
  getOne,
  create,
  deleteOne
};

export default groupMemberStreaks;
