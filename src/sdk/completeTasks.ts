import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";

const { APPLICATION_URL } = getServiceConfig();

const getAll = () => {
  return axios({
    method: "GET",
    url: `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.completeTasks}`
  });
};

const create = (userId: string, streakId: string) => {
  return axios({
    method: "POST",
    data: {
      userId,
      soloStreakId: streakId
    },
    url: `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.completeTasks}`
  });
};

const deleteOne = (completeTaskId: string) => {
  return axios({
    method: "DELETE",
    url: `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.completeTasks}/${completeTaskId}`
  });
};

const completeTasks = {
  getAll,
  create,
  deleteOne
};

export default completeTasks;
