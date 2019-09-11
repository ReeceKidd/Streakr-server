import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
const { APPLICATION_URL } = getServiceConfig();

import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";
import { SupportedRequestHeaders } from "../Server/headers";

const getAll = ({
  creatorId,
  memberId,
  timezone
}: {
  creatorId?: string;
  memberId?: string;
  timezone?: string;
}) => {
  let getAllSoloStreaksURL = `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.groupStreaks}?`;
  if (creatorId) {
    getAllSoloStreaksURL = `${getAllSoloStreaksURL}creatorId=${creatorId}&`;
  }
  if (memberId) {
    getAllSoloStreaksURL = `${getAllSoloStreaksURL}memberId=${memberId}&`;
  }
  if (timezone) {
    getAllSoloStreaksURL = `${getAllSoloStreaksURL}timezone=${timezone}`;
  }
  return axios.get(getAllSoloStreaksURL);
};

const getOne = (groupStreakId: string) => {
  return axios.get(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.groupStreaks}/${groupStreakId}`
  );
};

const create = ({
  creatorId,
  streakName,
  timezone,
  streakDescription,
  numberOfMinutes,
  members
}: {
  creatorId: string;
  streakName: string;
  timezone: string;
  members: { memberId: string; groupMemberStreakId?: string }[];
  streakDescription?: string;
  numberOfMinutes?: number;
}) => {
  return axios.post(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.groupStreaks}`,
    { creatorId, streakName, streakDescription, numberOfMinutes, members },
    { headers: { [SupportedRequestHeaders.xTimezone]: timezone } }
  );
};

const update = (
  groupStreakId: string,
  timezone: string,
  data?: {
    creatorId?: string;
    streakName?: string;
    streakDescription?: string;
    numberOfMinutes?: number;
    timezone?: string;
  }
) => {
  return axios.patch(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.groupStreaks}/${groupStreakId}`,
    data,
    { headers: { [SupportedRequestHeaders.xTimezone]: timezone } }
  );
};

const deleteOne = (groupStreakId: string) => {
  return axios.delete(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.groupStreaks}/${groupStreakId}`
  );
};

const groupStreaks = {
  getAll,
  getOne,
  create,
  update,
  deleteOne
};

export default groupStreaks;
