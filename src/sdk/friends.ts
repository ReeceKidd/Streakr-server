import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";
import { callbackify } from "util";
import { callbackPromise } from "nodemailer/lib/shared";
import streakoid from "./streakoid";
const { APPLICATION_URL } = getServiceConfig();

const getAll = (userId: string) => {
  return axios.get(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.users}/${userId}/${RouteCategories.friends}`
  );
};

const addFriend = (userId: string, friendId: string) => {
  return axios.post(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.users}/${userId}/${RouteCategories.friends}`,
    {
      friendId
    }
  );
};

const deleteOne = (userId: string, friendId: string) => {
  return axios.delete(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.users}/${userId}/${RouteCategories.friends}/${friendId}`
  );
};

const friends = {
  getAll,
  addFriend,
  deleteOne
};

export default friends;
