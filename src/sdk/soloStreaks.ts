import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
const { APPLICATION_URL } = getServiceConfig();

import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";

const getAll = () => {
  return axios({
    method: "GET",
    url: `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.soloStreaks}`
  });
};

const getOne = (soloStreakId: string) => {
  return axios({
    method: "GET",
    url: `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${soloStreakId}`
  });
};

const deleteOne = (soloStreakId: string) => {
  return axios({
    method: "DELETE",
    url: `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${soloStreakId}`
  });
};

const create = (
  userId: string,
  name: string,
  description: string,
  timezone: string
) => {
  return axios({
    method: "POST",
    url: `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.soloStreaks}`,
    data: {
      userId,
      name,
      description
    }
  });
};

const update = (soloStreakId: string, data: any) => {
  return axios({
    method: "PATCH",
    url: `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${soloStreakId}`,
    data
  });
};

const soloStreaks = {
  getAll,
  getOne,
  deleteOne,
  create,
  update
};

export default soloStreaks;
