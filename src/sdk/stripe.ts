import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";

const { APPLICATION_URL } = getServiceConfig();

const createSubscription = (token: string, id: string) => {
  return axios({
    method: "POST",
    url: `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.stripe}`
  });
};

const deleteSubscription = (subscription: string, id: string) => {
  return axios({
    method: "DELETE",
    url: `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.stripe}`
  });
};

const stripe = {
  createSubscription,
  deleteSubscription
};

export default stripe;
