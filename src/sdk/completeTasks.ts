import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";
import { SupportedRequestHeaders } from "../Server/headers";

const { APPLICATION_URL } = getServiceConfig();

const getAll = (userId?: string, streakId?: string) => {
  if (userId && !streakId) {
    return axios.get(
      `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.completeTasks}?userId=${userId}`
    );
  } else if (streakId && !userId) {
    return axios.get(
      `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.completeTasks}?streakId=${streakId}`
    );
  } else if (streakId && userId) {
    return axios.get(
      `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.completeTasks}?streakId=${streakId}&userId=${userId}`
    );
  } else {
    return axios.get(
      `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.completeTasks}`
    );
  }
};

const create = (userId: string, soloStreakId: string, timezone: string) => {
  return axios.post(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.completeTasks}`,
    {
      userId,
      soloStreakId
    },
    {
      headers: {
        [SupportedRequestHeaders.xTimezone]: timezone
      }
    }
  );
};

const deleteOne = (completeTaskId: string) => {
  return axios.delete(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.completeTasks}/${completeTaskId}`
  );
};

const completeTasks = {
  getAll,
  create,
  deleteOne
};

export default completeTasks;
