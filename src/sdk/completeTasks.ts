import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";
import { SupportedRequestHeaders } from "../Server/headers";
import { callbackify } from "util";

const { APPLICATION_URL } = getServiceConfig();

const getAll = (userId?: string, streakId?: string) => {
  let getAllURL = `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.completeTasks}?`;
  if (userId) {
    getAllURL = `${getAllURL}userId=${userId}&`;
  }
  if (streakId) {
    getAllURL = `${getAllURL}streakId=${streakId}&`;
  }

  return axios.get(getAllURL);
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
