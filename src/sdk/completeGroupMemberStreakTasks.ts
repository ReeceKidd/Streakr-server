import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";
import { SupportedRequestHeaders } from "../Server/headers";

const { APPLICATION_URL } = getServiceConfig();

const create = (
  userId: string,
  groupStreakId: string,
  groupMemberStreakId: string,
  timezone: string
) => {
  return axios.post(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.completeGroupMemberStreakTasks}`,
    {
      userId,
      groupStreakId,
      groupMemberStreakId
    },
    {
      headers: {
        [SupportedRequestHeaders.xTimezone]: timezone
      }
    }
  );
};

const completeGroupMemberStreakTasks = {
  create
};

export default completeGroupMemberStreakTasks;
