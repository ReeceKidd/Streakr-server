import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";
const { APPLICATION_URL } = getServiceConfig();

const getAll = (searchQuery: string) => {
  return axios.get(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.users}?searchQuery=${searchQuery}`
  );
};

const getOne = (userId: string) => {
  return axios.get(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.users}/${userId}`
  );
};

const create = (username: string, email: string) => {
  return axios.post(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.users}`,
    {
      username,
      email
    }
  );
};

const deleteOne = (userId: string) => {
  return axios.delete(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.users}/${userId}`
  );
};

const users = {
  getAll,
  getOne,
  create,
  deleteOne
};

export default users;
