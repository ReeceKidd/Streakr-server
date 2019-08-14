import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
const { APPLICATION_URL } = getServiceConfig();

import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";
import { SupportedRequestHeaders } from "../Server/headers";

const getAll = () => {
  return axios.get(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.soloStreaks}`
  );
};

const getOne = (soloStreakId: string) => {
  return axios.get(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${soloStreakId}`
  );
};

const create = (
  userId: string,
  name: string,
  description: string,
  timezone: string
) => {
  return axios.post(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.soloStreaks}`,
    { userId, name, description },
    { headers: { [SupportedRequestHeaders.xTimezone]: timezone } }
  );
};

const update = (
  soloStreakId: string,
  data: { name: string; description: string },
  timezone: string
) => {
  return axios.patch(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${soloStreakId}`,
    data,
    { headers: { [SupportedRequestHeaders.xTimezone]: timezone } }
  );
};

const deleteOne = (soloStreakId: string) => {
  return axios.delete(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${soloStreakId}`
  );
};

const soloStreaks = {
  getAll,
  getOne,
  deleteOne,
  create,
  update
};

export default soloStreaks;
