import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
const { APPLICATION_URL } = getServiceConfig();

import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";
import { SupportedRequestHeaders } from "../Server/headers";
import { GroupStreakRouteCategories } from "../Routers/versions/v1/groupStreakRouter";

const create = ({
  friendId,
  groupStreakId,
  timezone
}: {
  friendId: string;
  groupStreakId: string;
  timezone: string;
}) => {
  return axios.post(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.groupStreaks}/${groupStreakId}/${GroupStreakRouteCategories.members}`,
    { friendId },
    { headers: { [SupportedRequestHeaders.xTimezone]: timezone } }
  );
};

const groupMembers = {
  create
};

export default groupMembers;
