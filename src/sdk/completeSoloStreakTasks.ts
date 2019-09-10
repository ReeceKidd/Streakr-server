import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";
import { SupportedRequestHeaders } from "../Server/headers";

const { APPLICATION_URL } = getServiceConfig();

const getAll = (userId?: string, streakId?: string) => {
  let getAllURL = `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.completeSoloStreakTasks}?`;
  if (userId) {
    getAllURL = `${getAllURL}userId=${userId}&`;
  }
  if (streakId) {
    getAllURL = `${getAllURL}streakId=${streakId}`;
  }

  return axios.get(getAllURL);
};

const create = (userId: string, soloStreakId: string, timezone: string) => {
  return axios.post(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.completeSoloStreakTasks}`,
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

const deleteOne = (completeSoloStreakTaskId: string) => {
  return axios.delete(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.completeSoloStreakTasks}/${completeSoloStreakTaskId}`
  );
};

const completeSoloStreakTasks = {
  getAll,
  create,
  deleteOne
};

export default completeSoloStreakTasks;
