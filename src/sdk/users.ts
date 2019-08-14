import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";
const { APPLICATION_URL } = getServiceConfig();

const getAll = (searchQuery: string) => {
  return axios({
    method: "GET",
    url: `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.users}?searchQuery=${searchQuery}`
  });
};

const getOne = (userId: string) => {
  return axios({
    method: "GET",
    url: `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.users}/${userId}`
  });
};

const create = (username: string, email: string) => {
  return axios({
    method: "POST",
    url: `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.users}`,
    data: {
      username,
      email
    }
  });
};

const deleteOne = (userId: string) => {
  return axios({
    method: "DELETE",
    url: `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.users}/${userId}`
  });
};

const users = {
  getAll,
  getOne,
  create,
  deleteOne
};

export default users;
