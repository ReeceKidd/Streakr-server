import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";

const { APPLICATION_URL } = getServiceConfig();

const getAll = () => {
  return axios.get(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.completeTasks}`
  );
};

const create = (userId: string, streakId: string) => {
  return axios.post(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.completeTasks}`,
    {
      userId,
      streakId
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
